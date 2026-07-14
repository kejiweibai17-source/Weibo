import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const ICON_TEXTURE_PATH = "/3d/icon.png";
/** 星座滾動區維持原本霧感；特寫區另用 Poly Haven */
const HDR_PATH = "/hdr/studio.hdr";

let _cachedEnvTexture = null;
let _cachedEnvPath = null;

function applyIconTexture(mesh) {
  const loader = new THREE.TextureLoader();
  loader.load(ICON_TEXTURE_PATH, (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.flipY = true;
    tex.needsUpdate = true;

    mesh.material = new THREE.MeshStandardMaterial({
      name: "Constellation Icon",
      map: tex,
      color: new THREE.Color("#ffffff"),
      metalness: 0.1,
      roughness: 0.45,
      transparent: true,
      alphaTest: 0.05,
      depthWrite: true,
      depthTest: true,
      side: THREE.DoubleSide,
      envMapIntensity: 0.6,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    mesh.renderOrder = 3;
  });
}

/**
 * 100% 使用 GLB 自帶材質，不覆蓋任何顏色。
 * 只處理：隱藏背景、Icon 貼圖、金屬環境反射強度。
 */
export function finalizeSimaGlbModel(root) {
  root.traverse((child) => {
    if (!child.isMesh) return;

    const meshName = child.name ?? "";
    const material = child.material;
    const matName = material?.name ?? "";

    if (matName === "背景" || meshName.includes("背景")) {
      child.visible = false;
      return;
    }

    child.castShadow = true;
    child.receiveShadow = true;

    if (meshName === "Icon" || meshName.includes("Icon")) {
      applyIconTexture(child);
      return;
    }

    const mats = Array.isArray(material) ? material : material ? [material] : [];
    mats.forEach((mat) => {
      if (!mat) return;

      const metalness = typeof mat.metalness === "number" ? mat.metalness : 0;
      const nameLc = (mat.name ?? "").toLowerCase();
      const looksMetal =
        metalness >= 0.5 ||
        /盖|蓋|刀|metal|steel|silver|chrome|金/i.test(nameLc);

      if (looksMetal) {
        // 維持原本霧感金屬（不要鏡面高光）
        mat.metalness = Math.max(metalness, 0.85);
        if (typeof mat.roughness === "number") {
          mat.roughness = THREE.MathUtils.clamp(mat.roughness, 0.15, 0.35);
        } else {
          mat.roughness = 0.22;
        }
        mat.envMapIntensity = 1.15;
      } else {
        mat.envMapIntensity = 1.0;
      }

      mat.needsUpdate = true;
    });
  });
}

/**
 * PMREM 產生的環境貼圖是綁在「產生它的那個 WebGLRenderer / GL context」上的。
 * 頁面切走再切回來時，舊的 renderer 會被 dispose、GL context 也會跟著失效，
 * 但模組層級的 _cachedEnvTexture 卻還留著舊的參照 —— 如果之後又被新的 renderer
 * 拿去用，反射環境圖等於是指向一個已經死掉的 GL context，畫面就會變黑/ 沒有反射。
 * 所以每次 dispose 舊的 three.js 場景時，都要呼叫這個函式把快取一併清掉，
 * 讓下一次 setupSimaScrollSceneEnvironment 用「新的」renderer 重新產生一份。
 */
export function resetSimaEnvCache() {
  _cachedEnvTexture = null;
  _cachedEnvPath = null;
}

export function setupSimaScrollSceneEnvironment(renderer, scene) {
  // 整體環境反射亮度（three r163+ 支援；舊版忽略不影響）
  if ("environmentIntensity" in scene) {
    scene.environmentIntensity = 1.0;
  }

  const applyEnv = (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    _cachedEnvTexture = pmrem.fromEquirectangular(texture).texture;
    _cachedEnvPath = HDR_PATH;
    scene.environment = _cachedEnvTexture;
    texture.dispose();
    pmrem.dispose();
  };

  if (_cachedEnvTexture && _cachedEnvPath === HDR_PATH) {
    scene.environment = _cachedEnvTexture;
    return;
  }

  new RGBELoader().load(HDR_PATH, applyEnv);
}
