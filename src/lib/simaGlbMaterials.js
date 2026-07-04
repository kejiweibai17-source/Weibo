import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const ICON_TEXTURE_PATH = "/3d/icon.png";

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
 * 只處理：隱藏背景、Icon 貼圖、envMapIntensity。
 */
export function finalizeSimaGlbModel(root) {
  root.traverse((child) => {
    if (!child.isMesh) return;

    const meshName = child.name ?? "";
    const matName = child.material?.name ?? "";

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

    if (child.material) {
      child.material.envMapIntensity = 1.5;
      child.material.needsUpdate = true;
    }
  });
}

export function setupSimaScrollSceneEnvironment(renderer, scene) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
}
