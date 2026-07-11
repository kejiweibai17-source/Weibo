"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import gsap from "gsap";

const MODEL_PATH = "/3d/機身細節26.glb";
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

const METAL_MESH_HINT =
  /盖子|蓋子|上蓋|上盖|^刀$|刀网|刀網|德国刀|德國刀|机身链接|機身連結/i;

/** 預設載入／上蓋／刀頭共用：略小、螢幕正中；刀頭僅多上蓋飛離 */
const DEFAULT_POSE = {
  modelRot: { x: 0.18, y: -0.22, z: 0 },
  focusY: 0,
  /** 越小＝主體越小 */
  fill: 0.58,
  yaw: 0.1,
  pitch: 0.05,
};

const VIEW_POSE = {
  lid: { ...DEFAULT_POSE, lidOpen: false },
  blade: { ...DEFAULT_POSE, lidOpen: true },
};

const BUTTONS = [
  { key: "lid", label: "上蓋特寫", icon: "◈" },
  { key: "blade", label: "刀頭特寫", icon: "◉" },
];

function collectLidParts(root) {
  const parts = [];
  root.traverse((child) => {
    const name = child.name ?? "";
    if (LID_EXACT_NAMES.has(name)) parts.push(child);
  });
  return parts;
}

function shouldBeMetal(mesh) {
  const name = mesh.name ?? "";
  if (LID_EXACT_NAMES.has(name) || METAL_MESH_HINT.test(name)) return true;
  return /盖|蓋|刀|metal|steel|silver|chrome|金/i.test(
    mesh.material?.name ?? "",
  );
}

/** 參照產品圖上方拋光銀部材質 */
function applyPolyHavenMetal(mesh, envMap = null) {
  const sources = Array.isArray(mesh.material)
    ? mesh.material
    : mesh.material
      ? [mesh.material]
      : [];

  const next = sources.map((src) => {
    return new THREE.MeshStandardMaterial({
      name: `${src?.name || mesh.name || "part"}-chrome`,
      color: new THREE.Color("#c8d0da"),
      metalness: 1,
      roughness: 0.07,
      envMapIntensity: 2.0,
      envMap: envMap || src?.envMap || null,
      map: null,
      roughnessMap: null,
      metalnessMap: null,
      normalMap: src?.normalMap || null,
      normalScale: src?.normalScale?.clone?.() || new THREE.Vector2(0.6, 0.6),
      side: src?.side ?? THREE.FrontSide,
    });
  });

  mesh.material = next.length === 1 ? next[0] : next;
}

function bindEnvMapToMetals(root, envMap) {
  if (!root || !envMap) return;
  root.traverse((child) => {
    if (!child.isMesh || !shouldBeMetal(child)) return;
    const mats = Array.isArray(child.material)
      ? child.material
      : [child.material];
    mats.forEach((mat) => {
      if (!mat) return;
      mat.envMap = envMap;
      mat.color?.set("#c8d0da");
      mat.metalness = 1;
      mat.roughness = 0.07;
      mat.envMapIntensity = 2.0;
      mat.needsUpdate = true;
    });
  });
}

function frameCentered(camera, model, pose) {
  model.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  // 螢幕正中：對準模型中心
  const focus = new THREE.Vector3(
    center.x,
    center.y + size.y * pose.focusY,
    center.z,
  );

  const half = Math.max(size.x, size.y, size.z) * 0.5;
  const fov = THREE.MathUtils.degToRad(camera.fov);
  const distance = (half / Math.tan(fov / 2)) / pose.fill;

  const cam = new THREE.Vector3(
    focus.x + distance * pose.yaw,
    focus.y + distance * pose.pitch,
    focus.z + distance,
  );

  return { camera: cam, lookAt: focus };
}

function applyPoseInstant(camera, model, pose) {
  model.rotation.set(pose.modelRot.x, pose.modelRot.y, pose.modelRot.z);
  model.updateMatrixWorld(true);
  const framed = frameCentered(camera, model, pose);
  camera.position.copy(framed.camera);
  camera.lookAt(framed.lookAt);
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
  const lockedCamPosRef = useRef(null);
  const lockedLookAtRef = useRef(null);
  const rafRef = useRef(null);
  const [active, setActive] = useState("lid");
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let destroyed = false;

    const resizeToContainer = (renderer, camera) => {
      const rw = Math.max(el.clientWidth || 0, window.innerWidth);
      const rh = Math.max(el.clientHeight || 0, window.innerHeight);
      camera.aspect = rw / rh;
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
        if (modelRef.current) bindEnvMapToMetals(modelRef.current, envMap);
      },
      undefined,
      (err) => {
        console.error("[HomeScrollSequence01] HDR load failed", err);
      },
    );

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
          if (shouldBeMetal(child)) {
            applyPolyHavenMetal(child, envMap);
          } else if (child.material) {
            const mats = Array.isArray(child.material)
              ? child.material
              : [child.material];
            mats.forEach((m) => {
              if (m && "envMapIntensity" in m) {
                m.envMapIntensity = 0.75;
                m.needsUpdate = true;
              }
            });
          }
        });

        const box = new THREE.Box3().setFromObject(model);
        modelSizeRef.current = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        // 螢幕正中，不額外偏移

        lidPartsRef.current = collectLidParts(model);
        lidRestPosRef.current = lidPartsRef.current.map((p) =>
          p.position.clone(),
        );
        lidRestRotRef.current = lidPartsRef.current.map((p) =>
          p.rotation.clone(),
        );

        modelRef.current = model;
        scene.add(model);

        const framed = applyPoseInstant(camera, model, VIEW_POSE.lid);
        lookAtRef.current.copy(framed.lookAt);
        lockedCamPosRef.current = framed.camera.clone();
        lockedLookAtRef.current = framed.lookAt.clone();
      },
      undefined,
      (err) => {
        console.error("[HomeScrollSequence01] GLB load failed", err);
      },
    );

    function animate() {
      rafRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      resizeToContainer(renderer, camera);
      if (modelRef.current) {
        const framed = applyPoseInstant(
          camera,
          modelRef.current,
          VIEW_POSE.lid,
        );
        lockedCamPosRef.current = framed.camera.clone();
        lockedLookAtRef.current = framed.lookAt.clone();
        lookAtRef.current.copy(framed.lookAt);
        camera.position.copy(lockedCamPosRef.current);
        camera.lookAt(lockedLookAtRef.current);

        if (activeRef.current === "blade") {
          modelRef.current.rotation.set(
            VIEW_POSE.blade.modelRot.x,
            VIEW_POSE.blade.modelRot.y,
            VIEW_POSE.blade.modelRot.z,
          );
        }
      }
    }
    window.addEventListener("resize", onResize);

    // 若初次 mount 尺寸為 0，下一幀再量一次
    requestAnimationFrame(() => {
      if (!destroyed) onResize();
    });

    return () => {
      destroyed = true;
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
      pmrem.dispose();
      renderer.dispose();
      if (scene.environment?.dispose) scene.environment.dispose();
      el.replaceChildren();
      cameraRef.current = null;
      modelRef.current = null;
      lidPartsRef.current = [];
      lidRestPosRef.current = [];
      lidRestRotRef.current = [];
    };
  }, []);

  const goToView = useCallback((viewKey) => {
    const pose = VIEW_POSE[viewKey];
    const camera = cameraRef.current;
    const model = modelRef.current;
    if (!pose || !camera || !model) return;

    const lidParts = lidPartsRef.current;
    const lidRestPos = lidRestPosRef.current;
    const lidRestRot = lidRestRotRef.current;
    const modelSize = modelSizeRef.current;

    // 上蓋／刀頭都用預設載入構圖（正中、略小）
    model.rotation.set(pose.modelRot.x, pose.modelRot.y, pose.modelRot.z);
    const framed = applyPoseInstant(camera, model, VIEW_POSE.lid);
    lockedCamPosRef.current = framed.camera.clone();
    lockedLookAtRef.current = framed.lookAt.clone();
    lookAtRef.current.copy(framed.lookAt);

    if (!lidParts.length || !modelSize) return;

    const flyY = modelSize.y * 1.2;
    const flyX = modelSize.x * 0.45;
    const flyZ = modelSize.z * -0.25;

    lidParts.forEach((lid, i) => {
      const restPos = lidRestPos[i] || lid.position;
      const restRot = lidRestRot[i] || lid.rotation;

      if (pose.lidOpen) {
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
      setActive(key);
      goToView(key);
    },
    [goToView],
  );

  return (
    <section
      className="relative h-[100svh] w-full overflow-hidden"
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

      <div ref={containerRef} className="absolute inset-0 z-0 h-full w-full" />

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center">
        <div className="max-w-[20rem] px-6 md:ml-[6%] md:max-w-[26rem] md:px-0 lg:ml-[8%]">
          <h2 className="text-[2rem] font-light leading-tight tracking-[0.08em] text-white/95 md:text-[2.75rem]">
            小。很強大。
          </h2>
          <p className="mt-4 text-[0.95rem] font-light leading-7 tracking-wide text-white/70 md:mt-5 md:text-[1.05rem] md:leading-8">
            昔馬捍衛者，把刮鬍、修容、收納與快充，放進一個精巧而有份量的設計裡。
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-4 pb-10 md:pb-12">
        <p className="text-[11px] tracking-[0.2em] text-white/45 uppercase">
          選擇特寫視角
        </p>
        <div className="pointer-events-auto flex gap-3">
          {BUTTONS.map(({ key, label, icon }) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleView(key)}
                className={[
                  "flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium tracking-wide transition-all duration-300",
                  isActive
                    ? "bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] border border-[#A78BFA]/60 text-white shadow-[0_0_24px_rgba(139,92,246,0.55)] scale-[1.04]"
                    : "bg-[#1a0533]/70 border border-[#4C1D95]/50 text-[#EDE4FF] hover:bg-[#2e0f52]/80 hover:border-[#7C3AED]/60 backdrop-blur-sm shadow-[0_2px_12px_rgba(0,0,0,0.4)]",
                ].join(" ")}
              >
                <span className="text-xs opacity-70">{icon}</span>
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
