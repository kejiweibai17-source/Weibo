"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import gsap from "gsap";

const MODEL_PATH = "/3d/機身細節33.glb";
/** Poly Haven — studio_small_03 (CC0) */
const HDR_PATH = "/hdr/polyhaven-studio_small_03_1k.hdr";

const LID_EXACT_NAMES = new Set([
  "盖子",
  "蓋子",
  "盖子.001",
  "蓋子.001",
  "上蓋",
  "上盖",
]);

/** 星座圖騰開關的實際網格名稱，用於自動算出精準對焦點 */
const SWITCH_EXACT_NAMES = new Set(["按钮", "按钮.001", "按钮框"]);

/**
 * Type-C 充電接口的實際網格名稱，用於自動算出精準對焦點。
 * 機身細節33.glb 匯出後這兩個部件維持 Blender 預設的「立方體」命名，
 * 不再是舊版的 type-c-1 / type-c-2，這裡兩組名稱都保留以相容不同版本模型。
 */
const TYPEC_EXACT_NAMES = new Set(["type-c-1", "type-c-2", "立方體", "立方體.001"]);

/** 立方體：獨立渲染金屬材質；立方體.001：直接沿用機身外殼材質，融為一體 */
const CUBE_METAL_NAME = "立方體";
const CUBE_BODY_MATCH_NAME = "立方體.001";
const BODY_MATERIAL_SOURCE_NAME = "挤压";

/** 左右拖曳固定繞世界豎直軸（turntable 感），上下拖曳則繞「鏡頭當下的螢幕右方向」 */
const WORLD_UP_AXIS = new THREE.Vector3(0, 1, 0);

/**
 * 五個特寫視角設定。之後要微調某個特寫的角度／位置，只需要調整這裡的數字：
 * - modelRot：整台機身旋轉角度（rad），決定該部位正面朝向鏡頭的方向
 * - anchor：對焦點在模型外框中的相對位置（0~1），x/y/z 三軸；
 *   y:0 = 外框最底部，y:1 = 外框最頂部，x/z 同理
 * - meshNames：若該部位有專屬網格名稱，會自動用該網格的實際外框取代 anchor 估算值（更精準）
 * - fill：鏡頭拉近程度，數字越大越靠近、越容易裁切；越小越遠、模型越小
 * - yaw / pitch：鏡頭相對對焦點左右／上下偏移的角度，做出「側拍」的視角感
 * - lidOpen：是否要把上蓋飛開露出刀頭（僅「刀頭特寫」需要，其餘機制保留供未來擴充）
 */
const VIEWS = {
  port: {
    key: "port",
    label: "快充接口",
    title: "Type-C 快充接口",
    lines: ["通用 Type-C 充電，正反皆可插", "充電更快速、更便利"],
    modelRot: { x: -0.85, y: 0.4, z: 0 },
    anchor: { x: 0.5, y: 0.5, z: 0.5 },
    // 新模型有專屬 type-c-1 / type-c-2 網格，會自動取代上面的 anchor 估算值
    meshNames: TYPEC_EXACT_NAMES,
    focusY: -0.03,
    fill: 1.4,
    yaw: 0.02,
    pitch: -0.03,
    lidOpen: false,
  },
  switchBtn: {
    key: "switchBtn",
    label: "圖騰開關",
    title: "星座圖騰開關",
    lines: ["開關鍵鐫刻星座圖騰", "一鍵啟動，細節見質感"],
    modelRot: { x: 0.05, y: -0.05, z: 0 },
    anchor: { x: 0.5, y: 0.42, z: 0.85 },
    meshNames: SWITCH_EXACT_NAMES,
    focusY: 0,
    fill: 1.35,
    yaw: 0.04,
    pitch: 0.02,
    lidOpen: false,
  },
  shell: {
    key: "shell",
    label: "鋅合金外殼",
    title: "鋅合金外殼",
    lines: ["一體成型鋅合金機身", "分量沉穩、堅固耐用、質感升級"],
    modelRot: { x: 0.18, y: -0.55, z: 0 },
    anchor: { x: 0.5, y: 0.5, z: 0.5 },
    focusY: 0,
    fill: 0.85,
    yaw: 0.14,
    pitch: 0.06,
    lidOpen: false,
  },
  sparkle: {
    key: "sparkle",
    label: "星空閃點",
    title: "星空閃點工藝",
    lines: ["表面星空閃點特殊工藝", "光影流轉，低調中見精緻"],
    // 機身轉為正面（僅保留一點點俯角），閃點紋理正對鏡頭
    modelRot: { x: 0.1, y: -0.05, z: 0 },
    anchor: { x: 0.5, y: 0.55, z: 0.5 },
    focusY: 0,
    fill: 2.1,
    yaw: 0.02,
    pitch: 0.02,
    lidOpen: false,
  },
  blade: {
    key: "blade",
    label: "刀頭特寫",
    title: "德製精密刀頭",
    lines: ["上蓋自動分離，露出刀頭刀網", "剃淨貼合，兼顧防護與耐用"],
    // 機身大幅往前傾，鏡頭幾乎俯視刀頭刀網，機身則往後下方傾斜遠離鏡頭
    modelRot: { x: 1.1, y: -0.05, z: 0 },
    // 上蓋飛開後，刀頭會露出在機身「靠上方」的位置，對焦點要跟著往上移
    anchor: { x: 0.5, y: 0.85, z: 0.5 },
    focusY: 0,
    fill: 1.3,
    yaw: 0.02,
    pitch: 0,
    // 唯一需要把上蓋飛開露出刀頭的視角
    lidOpen: true,
  },
};

const VIEW_ORDER = ["port", "switchBtn", "shell", "sparkle", "blade"];

function collectPartsByNames(root, nameSet) {
  const parts = [];
  root.traverse((child) => {
    if (nameSet.has(child.name)) parts.push(child);
  });
  return parts;
}

function collectLidParts(root) {
  return collectPartsByNames(root, LID_EXACT_NAMES);
}

/**
 * 參考 ConstellationProductScroll（simaGlbMaterials.js）的做法：
 * 不整顆換新材質，而是直接微調 GLB 自帶材質的金屬度／粗糙度／環境反射強度，
 * 保留原始材質裡的貼圖／顏色資料，只是讓「看起來像金屬」更明顯、更正確。
 *
 * Blender「Dented Metal」這類資產庫材質常常無法把數值匯出成 glTF 的
 * pbrMetallicRoughness（金屬度／粗糙度全部落回規格預設值 1），所以這裡
 * 用比較明確、偏低的粗糙度＋較高的環境反射強度，確定它視覺上會呈現金屬感，
 * 而不是維持規格預設的「全粗糙、幾乎沒反射」灰白色。
 */
function tuneAsMetal(material, envMap) {
  const mats = Array.isArray(material) ? material : material ? [material] : [];
  mats.forEach((mat) => {
    if (!mat) return;
    mat.metalness = 1;
    mat.roughness =
      typeof mat.roughness === "number" && mat.roughness < 0.9
        ? THREE.MathUtils.clamp(mat.roughness, 0.12, 0.3)
        : 0.18;
    // 材質沒有貼圖時規格預設是純白，帶一點冷色調銀灰比較像拋光金屬，不會死白
    if (!mat.map) mat.color?.set("#d7dbe1");
    if (envMap) mat.envMap = envMap;
    mat.envMapIntensity = 1.6;
    mat.needsUpdate = true;
  });
}

/**
 * 從貼圖中間取樣一小塊區域算平均色，用來讓「共用機身材質」的部件即使 UV
 * 對不上，也能有一個貼近機身色調的純色，而不是直接共用貼圖材質時，因為
 * 立方體.001 自己的 UV 跟機身外殼不同，取樣貼圖時很容易採到圖集空白區
 * （通常是白色），導致看起來變成一片白，而不是機身該有的深色。
 */
function sampleAverageColor(texture) {
  try {
    const img = texture?.image;
    if (!img || !img.width || !img.height) return null;
    if (typeof document === "undefined") return null;
    const size = 12;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, size, size);
    const { data } = ctx.getImageData(0, 0, size, size);
    let r = 0;
    let g = 0;
    let b = 0;
    let count = 0;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count += 1;
    }
    if (!count) return null;
    return new THREE.Color(r / count / 255, g / count / 255, b / count / 255);
  } catch {
    return null;
  }
}

/**
 * 產生一份「視覺上跟機身一致，但不會有 UV 貼圖錯位問題」的材質：
 * 保留機身材質的金屬度／粗糙度手感，但拿掉貼圖，改用機身貼圖的平均色
 * （或保底的深紫灰色）當作純色，避免直接共用同一份貼圖材質時，
 * 因為兩邊 UV 不對應而取樣到貼圖空白處，整塊變成不自然的白色。
 */
function createBodyMatchMaterial(bodyMaterial, envMap) {
  const source = Array.isArray(bodyMaterial) ? bodyMaterial[0] : bodyMaterial;
  if (!source) return null;

  const fallbackColor = new THREE.Color("#1c1830");
  const sampled = sampleAverageColor(source.map);
  const clone = source.clone();
  clone.name = "body-match";
  clone.map = null;
  clone.color = sampled || fallbackColor;
  clone.metalness = typeof source.metalness === "number" ? source.metalness : 1;
  clone.roughness =
    typeof source.roughness === "number"
      ? THREE.MathUtils.clamp(source.roughness, 0.3, 0.55)
      : 0.42;
  if (envMap) clone.envMap = envMap;
  clone.envMapIntensity = 1.1;
  clone.needsUpdate = true;
  return clone;
}

function boxFromParts(parts) {
  const box = new THREE.Box3();
  parts.forEach((part, i) => {
    const partBox = new THREE.Box3().setFromObject(part);
    if (i === 0) box.copy(partBox);
    else box.union(partBox);
  });
  return box;
}

function anchorPoint(box, anchor) {
  const { min, max } = box;
  return new THREE.Vector3(
    min.x + (max.x - min.x) * anchor.x,
    min.y + (max.y - min.y) * anchor.y,
    min.z + (max.z - min.z) * anchor.z,
  );
}

/**
 * 依「球型包覆」計算鏡頭距離，並同時檢查垂直與水平視角（會隨螢幕寬高比變化）。
 * 這樣無論視窗被拉得多窄或多寬，模型的外框都保證完整落在畫面內，不會被裁到框外。
 */
function computeFitDistance(camera, radius, fill) {
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
  const distV = radius / Math.sin(vFov / 2);
  const distH = radius / Math.sin(hFov / 2);
  return Math.max(distV, distH) / Math.max(fill, 0.01);
}

/** 計算某個特寫視角所需的鏡頭位置與注視點，不會直接套用到 camera（供動畫過渡使用） */
function computeViewFrame(camera, model, view) {
  model.rotation.set(view.modelRot.x, view.modelRot.y, view.modelRot.z);
  model.updateMatrixWorld(true);

  const fullBox = new THREE.Box3().setFromObject(model);
  const size = fullBox.getSize(new THREE.Vector3());
  const overallRadius = fullBox.getBoundingSphere(new THREE.Sphere()).radius;

  let focusBox = fullBox;
  if (view.meshNames) {
    const parts = collectPartsByNames(model, view.meshNames);
    if (parts.length) focusBox = boxFromParts(parts);
  }

  const focus = anchorPoint(
    focusBox,
    view.anchor ?? { x: 0.5, y: 0.5, z: 0.5 },
  );
  focus.y += size.y * (view.focusY ?? 0);

  // 對焦局部區塊時仍以「整台外框」的半徑為縮放基準，避免局部框太小導致鏡頭貼進模型內部
  const distance = computeFitDistance(camera, overallRadius, view.fill);

  const camPos = new THREE.Vector3(
    focus.x + distance * (view.yaw ?? 0),
    focus.y + distance * (view.pitch ?? 0),
    focus.z + distance,
  );

  return { camera: camPos, lookAt: focus };
}

function applyFrameInstant(camera, framed) {
  camera.position.copy(framed.camera);
  camera.lookAt(framed.lookAt);
}

/**
 * 粒子星光背景：在模型後方的大球殼內灑滿點粒子，
 * 用自訂 shader 讓每顆星星以不同相位緩慢閃爍（twinkle），
 * 加法混色（AdditiveBlending）讓星點呈現柔和發光感。
 */
function createStarField() {
  const STAR_COUNT = 900;
  const positions = new Float32Array(STAR_COUNT * 3);
  const scales = new Float32Array(STAR_COUNT);
  const phases = new Float32Array(STAR_COUNT);
  const colors = new Float32Array(STAR_COUNT * 3);

  // 星色：白、薰衣草紫、淡金，呼應紫色調機身
  const palette = [
    new THREE.Color("#ffffff"),
    new THREE.Color("#c4b5fd"),
    new THREE.Color("#f5e6b8"),
    new THREE.Color("#a5b4fc"),
  ];

  for (let i = 0; i < STAR_COUNT; i++) {
    // 均勻分佈在半徑 7～20 的球殼上（模型只有 1～2 單位大，星星永遠在後景）
    const radius = 7 + Math.random() * 13;
    const theta = Math.random() * Math.PI * 2;
    const cosPhi = Math.random() * 2 - 1;
    const sinPhi = Math.sqrt(1 - cosPhi * cosPhi);
    positions[i * 3] = radius * sinPhi * Math.cos(theta);
    positions[i * 3 + 1] = radius * cosPhi;
    positions[i * 3 + 2] = radius * sinPhi * Math.sin(theta);

    scales[i] = 0.5 + Math.random() * 1.6;
    phases[i] = Math.random() * Math.PI * 2;

    const color = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
  geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
    },
    vertexShader: /* glsl */ `
      attribute float aScale;
      attribute float aPhase;
      attribute vec3 aColor;
      uniform float uTime;
      uniform float uPixelRatio;
      varying float vTwinkle;
      varying vec3 vColor;

      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        // 每顆星各自的閃爍節奏（0.35～1.0 之間呼吸）
        vTwinkle = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (0.6 + fract(aPhase) * 0.9) + aPhase));
        vColor = aColor;
        gl_PointSize = aScale * uPixelRatio * (36.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vTwinkle;
      varying vec3 vColor;

      void main() {
        // 柔和圓形光暈：中心亮、邊緣淡出
        float d = distance(gl_PointCoord, vec2(0.5));
        float alpha = smoothstep(0.5, 0.05, d);
        gl_FragColor = vec4(vColor, alpha * vTwinkle);
      }
    `,
  });

  return new THREE.Points(geometry, material);
}

/**
 * 從「刀頭特寫」(上蓋飛開) 切到其他視角時，若直接用當下模型外框計算對焦點，
 * 蓋子還飄在飛開的半路上，外框會偏高／偏移，算出來的鏡頭位置就會跟著跑掉。
 * 這裡在量測外框前，先暫時把蓋子物件搬回「關閉」的基準位置，量完再搬回原位，
 * 不會造成畫面閃動，但能確保每個視角的對焦點都是以「機身關閉」的固定幾何為準。
 */
function computeViewFrameAtRest(camera, model, view, lidParts, lidRestPos, lidRestRot) {
  if (!lidParts?.length) return computeViewFrame(camera, model, view);

  const savedPos = lidParts.map((p) => p.position.clone());
  const savedRot = lidParts.map((p) => p.rotation.clone());

  lidParts.forEach((part, i) => {
    const restPos = lidRestPos[i];
    const restRot = lidRestRot[i];
    if (restPos) part.position.copy(restPos);
    if (restRot) part.rotation.copy(restRot);
  });

  const framed = computeViewFrame(camera, model, view);

  lidParts.forEach((part, i) => {
    part.position.copy(savedPos[i]);
    part.rotation.copy(savedRot[i]);
  });
  model.updateMatrixWorld(true);

  return framed;
}

export default function HomeScrollSequence01() {
  const containerRef = useRef(null);
  const cameraRef = useRef(null);
  const modelRef = useRef(null);
  const lidPartsRef = useRef([]);
  const lidRestPosRef = useRef([]);
  const lidRestRotRef = useRef([]);
  const modelSizeRef = useRef(null);
  const lookAtRef = useRef(new THREE.Vector3(0, 0.3, 0));
  const camTweenRef = useRef(null);
  const lookTweenRef = useRef(null);
  const rafRef = useRef(null);
  const cubeMetalMaterialsRef = useRef([]);
  const dragStateRef = useRef({
    dragging: false,
    lastX: 0,
    lastY: 0,
    moved: false,
  });
  const [active, setActive] = useState(VIEW_ORDER[0]);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let destroyed = false;

    const resizeToContainer = (renderer, camera) => {
      const rw = el.clientWidth || window.innerWidth;
      const rh = el.clientHeight || window.innerHeight;
      camera.aspect = rw / Math.max(rh, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(rw, rh, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      return { rw, rh };
    };

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080012);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0.4, 1.0, 2.2);
    camera.lookAt(0.15, 0.25, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if ("outputColorSpace" in renderer) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    }
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    el.appendChild(renderer.domElement);
    // 手機必須允許垂直滾動：canvas 預設常會吃掉 touch，明確設 pan-y
    const canHover =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    renderer.domElement.style.touchAction = canHover ? "none" : "pan-y";
    renderer.domElement.style.display = "block";
    resizeToContainer(renderer, camera);

    // 先同步 RoomEnvironment，再換成 Poly Haven HDR 並綁到金屬材質
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    if ("environmentIntensity" in scene) scene.environmentIntensity = 1.1;

    new RGBELoader().load(
      HDR_PATH,
      (texture) => {
        if (destroyed) {
          texture.dispose();
          return;
        }
        texture.mapping = THREE.EquirectangularReflectionMapping;
        const envMap = pmrem.fromEquirectangular(texture).texture;
        scene.environment = envMap;
        if ("environmentIntensity" in scene) scene.environmentIntensity = 1.35;
        texture.dispose();
        cubeMetalMaterialsRef.current.forEach((mat) => {
          mat.envMap = envMap;
          mat.needsUpdate = true;
        });
      },
      undefined,
      (err) => {
        console.error("[HomeScrollSequence01] HDR load failed", err);
      },
    );

    // 粒子星光背景（純 three.js Points + shader，不需額外函式庫）
    const starField = createStarField();
    scene.add(starField);
    const clock = new THREE.Clock();

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const mainLight = new THREE.DirectionalLight(0xfff4e8, 1.25);
    mainLight.position.set(2.4, 3.5, 3.2);
    mainLight.castShadow = true;
    scene.add(mainLight);
    const fillLight = new THREE.DirectionalLight(0xdde8ff, 0.4);
    fillLight.position.set(-3, 1.2, -2);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.55);
    rimLight.position.set(0.2, 2.8, -3.2);
    scene.add(rimLight);

    new GLTFLoader().load(
      MODEL_PATH,
      (gltf) => {
        if (destroyed) return;

        const model = gltf.scene;
        const envMap = scene.environment;

        // 材質已在 Blender 端處理好，這裡單純使用 GLB 內建材質；
        // 只有「立方體」/「立方體.001」(Type-C 相關部件) 才用程式補上材質（見下方）
        let bodyMaterial = null;
        model.traverse((child) => {
          const name = child.name ?? "";
          const mat = child.material?.name ?? "";
          if (mat === "背景" || name.includes("背景")) {
            child.visible = false;
            return;
          }
          if (!child.isMesh) return;
          child.castShadow = true;
          child.receiveShadow = true;
          if (name === BODY_MATERIAL_SOURCE_NAME && !bodyMaterial) {
            bodyMaterial = Array.isArray(child.material)
              ? child.material[0]
              : child.material;
          }
        });

        cubeMetalMaterialsRef.current = [];
        model.traverse((child) => {
          if (!child.isMesh) return;
          const name = child.name ?? "";
          if (name === CUBE_METAL_NAME) {
            // 用 Poly Haven HDR 當反射環境，微調 GLB 自帶材質使其呈現正確金屬質感
            tuneAsMetal(child.material, envMap);
            const mats = Array.isArray(child.material)
              ? child.material
              : [child.material];
            cubeMetalMaterialsRef.current.push(...mats.filter(Boolean));
          } else if (name === CUBE_BODY_MATCH_NAME && bodyMaterial) {
            // 不直接共用機身貼圖材質（UV 不同會取樣到貼圖空白處變白），
            // 改用「拿掉貼圖、取平均色」的複製材質，色調金屬感一致但不會跑位
            const matched = createBodyMatchMaterial(bodyMaterial, envMap);
            if (matched) {
              child.material = matched;
              cubeMetalMaterialsRef.current.push(matched);
            }
          }
        });

        const box = new THREE.Box3().setFromObject(model);
        modelSizeRef.current = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        // 把置中後的模型包進 pivot 群組：pivot 原點正好位於機身幾何中心，
        // 之後所有旋轉（視角切換、拖曳）都作用在 pivot 上，模型才會「原地自轉」。
        // 若直接旋轉 gltf.scene，因為它的原點已被 position.sub(center) 偏移，
        // 旋轉軸心會偏離機身中心，拖曳時整台機身會繞著偏掉的點畫弧甩動。
        const pivot = new THREE.Group();
        pivot.add(model);

        lidPartsRef.current = collectLidParts(model);
        lidRestPosRef.current = lidPartsRef.current.map((p) =>
          p.position.clone(),
        );
        lidRestRotRef.current = lidPartsRef.current.map((p) =>
          p.rotation.clone(),
        );

        modelRef.current = pivot;
        scene.add(pivot);

        const framed = computeViewFrame(
          camera,
          pivot,
          VIEWS[activeRef.current],
        );
        applyFrameInstant(camera, framed);
        lookAtRef.current.copy(framed.lookAt);
      },
      undefined,
      (err) => {
        console.error("[HomeScrollSequence01] GLB load failed", err);
      },
    );

    // 拖曳 360° 僅桌機（fine pointer）；手機完全不綁 pointer，避免卡住頁面滾動。
    const ROTATE_SPEED = 0.0055;
    const drag = dragStateRef.current;
    let onPointerDown = null;
    let onPointerMove = null;
    let onPointerUp = null;

    if (canHover) {
      onPointerDown = (e) => {
        if (!modelRef.current) return;
        if (e.pointerType === "touch") return;
        if (e.pointerType === "mouse" && e.button !== 0) return;
        drag.dragging = true;
        drag.moved = false;
        drag.lastX = e.clientX;
        drag.lastY = e.clientY;
        el.style.cursor = "grabbing";
        el.setPointerCapture?.(e.pointerId);
      };
      onPointerMove = (e) => {
        if (!drag.dragging || !modelRef.current) return;
        const dx = e.clientX - drag.lastX;
        const dy = e.clientY - drag.lastY;
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) drag.moved = true;
        drag.lastX = e.clientX;
        drag.lastY = e.clientY;
        const model = modelRef.current;

        // 左右繞世界豎直軸；上下繞鏡頭螢幕右方向，拖曳方向不歪斜。
        model.rotateOnWorldAxis(WORLD_UP_AXIS, dx * ROTATE_SPEED);

        const appliedPitch = dy * ROTATE_SPEED;
        const camera = cameraRef.current;
        if (camera && appliedPitch !== 0) {
          const screenRight = new THREE.Vector3();
          camera.getWorldDirection(screenRight);
          screenRight.cross(camera.up).normalize();
          if (screenRight.lengthSq() > 0.0001) {
            model.rotateOnWorldAxis(screenRight, appliedPitch);
          }
        }
      };
      onPointerUp = (e) => {
        if (!drag.dragging) return;
        drag.dragging = false;
        el.style.cursor = "grab";
        el.releasePointerCapture?.(e.pointerId);
      };
      el.style.cursor = "grab";
      el.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
    } else {
      el.style.cursor = "default";
      el.style.pointerEvents = "none";
      renderer.domElement.style.pointerEvents = "none";
    }

    function animate() {
      rafRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      starField.material.uniforms.uTime.value = elapsed;
      // 星空整體極緩慢漂移，增加空間深度感
      starField.rotation.y = elapsed * 0.012;
      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      resizeToContainer(renderer, camera);
      const model = modelRef.current;
      if (!model) return;

      // 視窗尺寸變動時，重新用「目前所在」的視角重新對焦，不要跳回預設視角，
      // 也不要中斷正在飛開的上蓋動畫。
      camTweenRef.current?.kill();
      lookTweenRef.current?.kill();
      const framed = computeViewFrameAtRest(
        camera,
        model,
        VIEWS[activeRef.current],
        lidPartsRef.current,
        lidRestPosRef.current,
        lidRestRotRef.current,
      );
      applyFrameInstant(camera, framed);
      lookAtRef.current.copy(framed.lookAt);
    }
    window.addEventListener("resize", onResize);

    // 若初次 mount 尺寸為 0，下一幀再量一次
    requestAnimationFrame(() => {
      if (!destroyed) onResize();
    });

    return () => {
      destroyed = true;
      window.removeEventListener("resize", onResize);
      if (onPointerDown) {
        el.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerUp);
      }
      cancelAnimationFrame(rafRef.current);
      camTweenRef.current?.kill();
      lookTweenRef.current?.kill();
      scene.remove(starField);
      starField.geometry.dispose();
      starField.material.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (scene.environment?.dispose) scene.environment.dispose();
      el.replaceChildren();
      cameraRef.current = null;
      modelRef.current = null;
      lidPartsRef.current = [];
      lidRestPosRef.current = [];
      lidRestRotRef.current = [];
      cubeMetalMaterialsRef.current = [];
    };
  }, []);

  const goToView = useCallback((viewKey) => {
    const view = VIEWS[viewKey];
    const camera = cameraRef.current;
    const model = modelRef.current;
    if (!view || !camera || !model) return;

    const lidParts = lidPartsRef.current;
    const lidRestPos = lidRestPosRef.current;
    const lidRestRot = lidRestRotRef.current;
    const modelSize = modelSizeRef.current;

    const framed = computeViewFrameAtRest(
      camera,
      model,
      view,
      lidParts,
      lidRestPos,
      lidRestRot,
    );
    camTweenRef.current?.kill();
    lookTweenRef.current?.kill();

    camTweenRef.current = gsap.to(camera.position, {
      x: framed.camera.x,
      y: framed.camera.y,
      z: framed.camera.z,
      duration: 1.1,
      ease: "power3.inOut",
      overwrite: "auto",
    });

    const lookProxy = lookAtRef.current;
    lookTweenRef.current = gsap.to(lookProxy, {
      x: framed.lookAt.x,
      y: framed.lookAt.y,
      z: framed.lookAt.z,
      duration: 1.1,
      ease: "power3.inOut",
      overwrite: "auto",
      onUpdate: () => camera.lookAt(lookProxy),
    });

    if (!lidParts.length || !modelSize) return;

    const flyY = modelSize.y * 1.2;
    const flyX = modelSize.x * 0.45;
    const flyZ = modelSize.z * -0.25;

    lidParts.forEach((lid, i) => {
      const restPos = lidRestPos[i] || lid.position;
      const restRot = lidRestRot[i] || lid.rotation;

      if (view.lidOpen) {
        gsap.to(lid.position, {
          x: restPos.x + flyX,
          y: restPos.y + flyY,
          z: restPos.z + flyZ,
          duration: 1.55,
          ease: "power4.in",
          overwrite: "auto",
        });
        gsap.to(lid.rotation, {
          x: restRot.x - 0.65,
          y: restRot.y + 0.25,
          z: restRot.z + 0.4,
          duration: 1.55,
          ease: "power4.in",
          overwrite: "auto",
        });
      } else {
        gsap.to(lid.position, {
          x: restPos.x,
          y: restPos.y,
          z: restPos.z,
          duration: 1.15,
          ease: "power3.out",
          overwrite: "auto",
        });
        gsap.to(lid.rotation, {
          x: restRot.x,
          y: restRot.y,
          z: restRot.z,
          duration: 1.15,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    });
  }, []);

  const handleView = useCallback(
    (key) => {
      if (key === activeRef.current) return;
      setActive(key);
      goToView(key);
    },
    [goToView],
  );

  const currentView = VIEWS[active];

  return (
    <section
      className="relative h-[100svh] w-full overflow-hidden touch-pan-y"
      style={{
        background:
          "linear-gradient(160deg, #0d0020 0%, #08001a 50%, #0a0015 100%)",
      }}
      aria-label="產品 3D 特寫互動展示"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 58% 52%, rgba(120,60,200,0.16) 0%, transparent 70%)",
        }}
      />

      <div
        ref={containerRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full select-none md:pointer-events-auto md:touch-none"
      />

      {/* 手機版：文字上下錯開，避免跟下方特寫細節、底部按鈕互相重疊；桌機維持左右對稱置中 */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-6 pt-8 md:inset-0 md:flex md:items-center md:px-0 md:pt-0">
        <div className="max-w-[19rem] md:ml-[6%] md:max-w-[26rem] lg:ml-[8%]">
          <h2 className="text-[1.6rem] font-light leading-tight tracking-[0.08em] text-white/95 md:text-[2.75rem]">
            小。很強大。
          </h2>
          <p className="mt-3 text-[0.85rem] font-light leading-6 tracking-wide text-white/70 md:mt-5 md:text-[1.05rem] md:leading-8">
            把刮鬍、修容、收納與快充，放進一個精巧而有份量的設計裡。
          </p>
        </div>
      </div>

      <div
        key={active}
        className="pointer-events-none absolute inset-x-0 bottom-[8.5rem] z-10 px-6 md:inset-0 md:flex md:items-center md:justify-end md:px-0 md:translate-y-[6vh]"
      >
        <div className="max-w-[19rem] md:mr-[6%] md:max-w-[22rem] md:text-right lg:mr-[8%]">
          <p className="text-[11px] tracking-[0.2em] text-[#B79CFF]/80 uppercase">
            特寫細節
          </p>
          <h3 className="mt-2 text-[1.2rem] font-light tracking-[0.04em] text-white/95 md:text-[1.7rem]">
            {currentView.title}
          </h3>
          {currentView.lines.map((line) => (
            <p
              key={line}
              className="mt-1.5 text-[0.8rem] font-light leading-5 tracking-wide text-white/65 md:mt-2 md:text-[0.95rem] md:leading-6"
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-3 pb-8 md:gap-4 md:pb-12">
        <p className="px-6 text-center text-[11px] tracking-[0.2em] text-white/45 uppercase">
          <span className="hidden md:inline">拖曳畫面可 360° 旋轉查看 ・ </span>
          選擇特寫視角
        </p>
        <div className="pointer-events-auto flex w-full gap-3 overflow-x-auto overscroll-x-contain touch-manipulation px-6 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-proximity md:w-auto md:flex-wrap md:justify-center md:overflow-visible md:touch-auto md:px-0 [&::-webkit-scrollbar]:hidden">
          {VIEW_ORDER.map((key) => {
            const view = VIEWS[key];
            const isActive = active === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleView(key)}
                className={[
                  "shrink-0 snap-start rounded-full px-4 py-2 text-[13px] font-medium tracking-wide transition-all duration-300 md:px-5 md:py-2.5 md:text-sm",
                  isActive
                    ? "bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] border border-[#A78BFA]/60 text-white shadow-[0_0_24px_rgba(139,92,246,0.55)] scale-[1.04]"
                    : "bg-[#1a0533]/70 border border-[#4C1D95]/50 text-[#EDE4FF] hover:bg-[#2e0f52]/80 hover:border-[#7C3AED]/60 backdrop-blur-sm shadow-[0_2px_12px_rgba(0,0,0,0.4)]",
                ].join(" ")}
              >
                {view.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
