"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import gsap from "gsap";

const MODEL_PATH = "/3d/機身細節26.glb";
/** Poly Haven — studio_small_03 (CC0) */
const HDR_PATH = "/hdr/polyhaven-studio_small_03_1k.hdr";

/** GLB 外蓋節點為簡體「盖子」；不要移動「盖子内部」（刀頭／刀網） */
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

/**
 * 特寫：只取產品上半部，往前傾以看清刀頭／上蓋
 */
const VIEWS = {
  lid: {
    camera: { x: 0.32, y: 0.48, z: 0.98 },
    lookAt: { x: 0.2, y: 0.4, z: 0 },
    modelRot: { x: -0.58, y: -0.38, z: 0.03 },
    lidOpen: false,
  },
  blade: {
    camera: { x: 0.26, y: 0.42, z: 0.88 },
    lookAt: { x: 0.18, y: 0.44, z: 0 },
    modelRot: { x: -0.72, y: -0.28, z: 0.02 },
    lidOpen: true,
  },
};

const BUTTONS = [
  { key: "lid", label: "上蓋特寫", icon: "◈" },
  { key: "blade", label: "刀頭特寫", icon: "◉" },
];

function collectLidParts(root) {
  const parts = [];
  root.traverse((child) => {
    const name = child.name ?? "";
    if (!name) return;
    if (LID_EXACT_NAMES.has(name)) {
      parts.push(child);
    }
  });
  return parts;
}

function shouldBeMetal(mesh) {
  const name = mesh.name ?? "";
  if (LID_EXACT_NAMES.has(name)) return true;
  if (METAL_MESH_HINT.test(name)) return true;
  const matName = mesh.material?.name ?? "";
  return /盖|蓋|刀|metal|steel|silver|chrome|金/i.test(matName);
}

function applyChromeMetal(mesh) {
  const mats = Array.isArray(mesh.material)
    ? mesh.material
    : mesh.material
      ? [mesh.material]
      : [];

  mats.forEach((src) => {
    if (!src) return;

    // 換成乾淨金屬，避免原 roughnessMap／霧面貼圖把質感洗成霧灰
    const metal = new THREE.MeshStandardMaterial({
      name: `${src.name || mesh.name || "metal"}-chrome`,
      color: new THREE.Color("#d8dce2"),
      metalness: 1,
      roughness: 0.08,
      envMapIntensity: 1.75,
      map: src.map || null,
      normalMap: src.normalMap || null,
      normalScale: src.normalScale
        ? src.normalScale.clone()
        : new THREE.Vector2(1, 1),
      side: src.side ?? THREE.FrontSide,
    });

    // 有漫反射貼圖時略提亮，避免貼圖把金屬壓成霧面
    if (metal.map) {
      metal.color.set("#f0f2f5");
      metal.roughness = 0.12;
    }

    if (Array.isArray(mesh.material)) {
      const idx = mesh.material.indexOf(src);
      if (idx >= 0) mesh.material[idx] = metal;
    } else {
      mesh.material = metal;
    }
  });
}

function loadPolyHavenEnvironment(renderer, scene, onReady) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  new RGBELoader().load(
    HDR_PATH,
    (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      const envMap = pmrem.fromEquirectangular(texture).texture;
      scene.environment = envMap;
      if ("environmentIntensity" in scene) {
        scene.environmentIntensity = 1.15;
      }
      texture.dispose();
      pmrem.dispose();
      onReady?.();
    },
    undefined,
    () => {
      pmrem.dispose();
      onReady?.();
    },
  );
}

export default function HomeScrollSequence01() {
  const containerRef = useRef(null);

  const cameraRef = useRef(null);
  const modelRef = useRef(null);
  const lidPartsRef = useRef([]);
  const lidRestYRef = useRef([]);
  const modelSizeRef = useRef(null);
  const rafRef = useRef(null);

  const [active, setActive] = useState(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let destroyed = false;

    const w = el.clientWidth || window.innerWidth;
    const h = el.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080012);

    const camera = new THREE.PerspectiveCamera(36, w / h, 0.1, 100);
    const iv = VIEWS.lid;
    camera.position.set(iv.camera.x, iv.camera.y, iv.camera.z);
    camera.lookAt(iv.lookAt.x, iv.lookAt.y, iv.lookAt.z);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if ("outputColorSpace" in renderer)
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    el.appendChild(renderer.domElement);

    loadPolyHavenEnvironment(renderer, scene);

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const mainLight = new THREE.DirectionalLight(0xfff6ee, 1.05);
    mainLight.position.set(2.2, 3.2, 3.5);
    mainLight.castShadow = true;
    scene.add(mainLight);
    const fill = new THREE.DirectionalLight(0xdde8ff, 0.35);
    fill.position.set(-2.5, 1.2, -1.5);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xe8ddff, 0.45);
    rim.position.set(0.5, 2.5, -3);
    scene.add(rim);

    new GLTFLoader().load(MODEL_PATH, (gltf) => {
      if (destroyed) return;

      const model = gltf.scene;

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
          applyChromeMetal(child);
        } else if (child.material) {
          const mats = Array.isArray(child.material)
            ? child.material
            : [child.material];
          mats.forEach((m) => {
            if (!m) return;
            if ("envMapIntensity" in m) m.envMapIntensity = 0.85;
            m.needsUpdate = true;
          });
        }
      });

      const box = new THREE.Box3().setFromObject(model);
      modelSizeRef.current = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);
      // 產品略偏右，對齊紅框構圖
      model.position.x += 0.18;
      model.position.y -= 0.06;

      const lidParts = collectLidParts(model);
      lidPartsRef.current = lidParts;
      lidRestYRef.current = lidParts.map((part) => part.position.y);

      model.rotation.set(iv.modelRot.x, iv.modelRot.y, iv.modelRot.z);
      modelRef.current = model;
      scene.add(model);
    });

    function animate() {
      rafRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      const rw = el.clientWidth || window.innerWidth;
      const rh = el.clientHeight || window.innerHeight;
      camera.aspect = rw / rh;
      camera.updateProjectionMatrix();
      renderer.setSize(rw, rh);
    }
    window.addEventListener("resize", onResize);

    return () => {
      destroyed = true;
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      if (scene.environment?.dispose) scene.environment.dispose();
      el.replaceChildren();
      cameraRef.current = null;
      modelRef.current = null;
      lidPartsRef.current = [];
      lidRestYRef.current = [];
    };
  }, []);

  const goToView = useCallback((viewKey) => {
    const view = VIEWS[viewKey];
    if (!view) return;
    const camera = cameraRef.current;
    const model = modelRef.current;
    const lidParts = lidPartsRef.current;
    const lidRestYs = lidRestYRef.current;
    const modelSize = modelSizeRef.current;
    if (!camera || !model) return;

    gsap.to(camera.position, {
      x: view.camera.x,
      y: view.camera.y,
      z: view.camera.z,
      duration: 1.4,
      ease: "power3.inOut",
      overwrite: "auto",
      onUpdate: () =>
        camera.lookAt(view.lookAt.x, view.lookAt.y, view.lookAt.z),
    });
    gsap.to(model.rotation, {
      x: view.modelRot.x,
      y: view.modelRot.y,
      z: view.modelRot.z,
      duration: 1.4,
      ease: "power3.inOut",
      overwrite: "auto",
    });

    if (lidParts.length && modelSize) {
      const liftAmount = modelSize.y * 0.55;
      lidParts.forEach((lid, i) => {
        const restY = lidRestYs[i] ?? lid.position.y;
        gsap.to(lid.position, {
          y: view.lidOpen ? restY + liftAmount : restY,
          duration: view.lidOpen ? 1.4 : 1.1,
          ease: view.lidOpen ? "power2.inOut" : "power3.out",
          overwrite: "auto",
        });
      });
    }
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

      <div ref={containerRef} className="absolute inset-0 h-full w-full" />

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
