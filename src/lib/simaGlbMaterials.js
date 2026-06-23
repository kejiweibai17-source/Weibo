import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/** 消光鈦金屬機身（主體22222）— 改 color / metalness / roughness 調整機身 */
export const SIMA_MATTE_TITANIUM = {
  color: "#63686d",
  metalness: 0.93,
  roughness: 0.68,
  clearcoat: 0.06,
  clearcoatRoughness: 0.62,
  envMapIntensity: 1.05,
};

/** 白銀色金屬（上蓋 + 按鍵立方體 共用） */
export const SIMA_SILVER_METAL = {
  color: "#f6f8fb",
  metalness: 1,
  roughness: 0.28,
  clearcoat: 0.88,
  clearcoatRoughness: 0.06,
  envMapIntensity: 3,
};

/** @deprecated 使用 SIMA_SILVER_METAL */
export const SIMA_SILVER_LID_CAP = SIMA_SILVER_METAL;

/** @deprecated 使用 SIMA_SILVER_METAL */
export const SIMA_SILVER_LID = SIMA_SILVER_METAL;

/** @deprecated 使用 SIMA_MATTE_TITANIUM */
export const SIMA_SPACE_GRAY = SIMA_MATTE_TITANIUM;

/** @deprecated 使用 SIMA_SILVER_LID */
export const SIMA_CHROME_LID = SIMA_SILVER_LID;

/** 中間 logo 環：白銀金屬帶 */
export const SIMA_TRIM_RING = {
  color: "#d8dde3",
  metalness: 1,
  roughness: 0.22,
  clearcoat: 0.5,
  clearcoatRoughness: 0.16,
  envMapIntensity: 1.8,
};

/** 電源鍵：消光鈦、略深 */
export const SIMA_BUTTON = {
  color: "#727880",
  metalness: 0.88,
  roughness: 0.82,
  clearcoat: 0.04,
  clearcoatRoughness: 0.6,
  envMapIntensity: 0.95,
};

export function createSimaPBR(name, preset) {
  const mat = new THREE.MeshPhysicalMaterial({
    name,
    color: new THREE.Color(preset.color),
    metalness: preset.metalness,
    roughness: preset.roughness,
    clearcoat: preset.clearcoat ?? 0,
    clearcoatRoughness: preset.clearcoatRoughness ?? 0.3,
    envMapIntensity: preset.envMapIntensity ?? 1,
    flatShading: false,
    side: THREE.FrontSide,
  });

  if (preset.sheen != null) {
    mat.sheen = preset.sheen;
    mat.sheenRoughness = preset.sheenRoughness ?? 0.5;
    mat.sheenColor = new THREE.Color(preset.sheenColor ?? "#ffffff");
  }

  return mat;
}

function fixTextureColorSpace(mat) {
  if (!mat) return;
  [
    "map",
    "emissiveMap",
    "normalMap",
    "roughnessMap",
    "metalnessMap",
    "aoMap",
  ].forEach((key) => {
    const tex = mat[key];
    if (tex?.isTexture) {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
    }
  });
}

function smoothMeshGeometry(geometry) {
  const merged = mergeVertices(geometry, 1e-4);
  merged.computeVertexNormals();
  return merged;
}

function isSilverMetalMesh(meshName) {
  return (
    meshName.includes("上蓋") ||
    meshName.includes("立方體") ||
    meshName.includes("中間層")
  );
}

function stripMapsForPBR(mat) {
  [
    "map",
    "normalMap",
    "roughnessMap",
    "metalnessMap",
    "aoMap",
    "bumpMap",
    "displacementMap",
    "emissiveMap",
    "alphaMap",
  ].forEach((key) => {
    if (mat[key]) mat[key] = null;
  });
  mat.needsUpdate = true;
}

function resolveSimaMaterial(meshName) {
  if (isSilverMetalMesh(meshName)) {
    const mat = createSimaPBR("Silver Metal", SIMA_SILVER_METAL);
    stripMapsForPBR(mat);
    return mat;
  }
  if (meshName.includes("主體")) {
    return createSimaPBR("Matte Titanium Body", SIMA_MATTE_TITANIUM);
  }
  return createSimaPBR("Matte Titanium Body", SIMA_MATTE_TITANIUM);
}

function applyLogoDecalMaterial(mesh) {
  const source = mesh.material;
  const map = source?.map ?? null;

  if (map) {
    map.colorSpace = THREE.SRGBColorSpace;
    map.needsUpdate = true;
  }

  mesh.material = new THREE.MeshStandardMaterial({
    name: "SMASMALL Logo",
    map,
    color: new THREE.Color("#ffffff"),
    metalness: 0,
    roughness: 0.55,
    transparent: true,
    alphaTest: 0.12,
    depthWrite: true,
    depthTest: true,
    side: THREE.DoubleSide,
    envMapIntensity: 0.55,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });

  mesh.renderOrder = 2;
}

/**
 * logo(白) 在 GLB 匯出時 TRS 偏移，重新對齊到中間層飾條
 */
export function fixSimaLogoAttachment(root) {
  let logo = null;
  let trim = null;

  root.traverse((obj) => {
    const name = obj.name ?? "";
    if (name.includes("logo") && obj.isMesh) logo = obj;
    if (name === "中間層.002") trim = obj;
  });

  if (!logo || !trim) return;

  logo.position.copy(trim.position);
  logo.quaternion.copy(trim.quaternion);

  const outward = new THREE.Vector3(0, 0, 1).applyQuaternion(trim.quaternion);
  const lateral = new THREE.Vector3(-0.14, 0.02, 0).applyQuaternion(
    trim.quaternion,
  );

  logo.position.add(outward.multiplyScalar(0.11));
  logo.position.add(lateral);

  const band = trim.scale.x || 0.083;
  logo.scale.set(band * 4.1, band * 1.05, band * 1.05);
}

export function finalizeSimaGlbModel(root) {
  applySimaGlbMaterials(root);
  fixSimaLogoAttachment(root);
}

/** 依 mesh 名稱套用昔馬 GLB 材質（鏡面蓋 / 消光機身 / logo 環） */
export function applySimaGlbMaterials(root) {
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

    if (child.geometry) {
      if (isSilverMetalMesh(meshName)) {
        child.geometry = smoothMeshGeometry(child.geometry);
      } else {
        child.geometry.computeVertexNormals();
      }
    }

    if (matName.includes("logo") || meshName.includes("logo")) {
      applyLogoDecalMaterial(child);
      return;
    }

    child.material = resolveSimaMaterial(meshName);
  });
}

export function setupSimaScrollSceneEnvironment(renderer, scene) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
}
