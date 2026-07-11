import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const ICON_TEXTURE_PATH = "/3d/icon.png";
/** Poly Haven — studio_small_03 (CC0) */
const HDR_PATH = "/hdr/polyhaven-studio_small_03_1k.hdr";

let _cachedEnvTexture = null;

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
        // 金屬（銀色蓋子/刀頭）：乾淨反射，避免霧面
        mat.metalness = 1;
        mat.roughness = 0.08;
        if (mat.roughnessMap) mat.roughnessMap = null;
        if (mat.metalnessMap) mat.metalnessMap = null;
        mat.envMapIntensity = 1.6;
      } else {
        mat.envMapIntensity = 1.0;
      }

      mat.needsUpdate = true;
    });
  });
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
    scene.environment = _cachedEnvTexture;
    texture.dispose();
    pmrem.dispose();
  };

  if (_cachedEnvTexture) {
    scene.environment = _cachedEnvTexture;
    return;
  }

  new RGBELoader().load(HDR_PATH, applyEnv);
}
