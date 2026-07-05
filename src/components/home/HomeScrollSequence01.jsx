"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import gsap from "gsap";

const MODEL_PATH = "/3d/特寫.glb";

/** 與原版 S3GroomingPrecision SLIDES 完全一致的參數 */
const VIEWS = {
  lid: {
    camera: { x: 0.3, y: 1.2, z: 1.8 },
    lookAt: { x: 0, y: 0.4, z: 0 },
    modelRot: { x: -Math.PI * 0.12, y: -Math.PI * 0.08, z: 0 },
    lidOpen: false,
  },
  blade: {
    camera: { x: 0.3, y: 2.8, z: 1.2 },
    lookAt: { x: 0, y: 0.5, z: 0 },
    modelRot: { x: -Math.PI * 0.35, y: Math.PI * 0.1, z: 0 },
    lidOpen: true,
  },
};

const BUTTONS = [
  { key: "lid", label: "上蓋特寫", icon: "◈" },
  { key: "blade", label: "刀頭特寫", icon: "◉" },
];

export default function HomeScrollSequence01() {
  const containerRef = useRef(null);

  /* Three.js 物件存在 refs 裡，不觸發 re-render */
  const cameraRef = useRef(null);
  const modelRef = useRef(null);
  const lidRef = useRef(null);
  const lidRestYRef = useRef(0);
  const modelSizeRef = useRef(null);
  const rafRef = useRef(null);

  const [active, setActive] = useState(null);

  /* ── Three.js 初始化 ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    /* 用閉包旗標，避免 React Strict Mode 雙次 effect 污染 */
    let destroyed = false;

    /* 尺寸：clientWidth/Height 可能在 mount 時為 0，fallback 到 window */
    const w = el.clientWidth || window.innerWidth;
    const h = el.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080012);

    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    const iv = VIEWS.lid;
    camera.position.set(iv.camera.x, iv.camera.y, iv.camera.z);
    camera.lookAt(iv.lookAt.x, iv.lookAt.y, iv.lookAt.z);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if ("outputColorSpace" in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    el.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(2, 3, 4);
    mainLight.castShadow = true;
    scene.add(mainLight);
    const fill = new THREE.DirectionalLight(0xffffff, 0.4);
    fill.position.set(-3, 1, -2);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xd4e0ff, 0.5);
    rim.position.set(0, 4, -3);
    scene.add(rim);

    new GLTFLoader().load(MODEL_PATH, (gltf) => {
      /* 若 effect 已被 cleanup，丟棄這次載入結果 */
      if (destroyed) return;

      const model = gltf.scene;

      model.traverse((child) => {
        const name = child.name ?? "";
        const mat = child.material?.name ?? "";
        if (mat === "背景" || name.includes("背景")) {
          child.visible = false;
          return;
        }
        if (name === "上蓋" || name.includes("上蓋")) {
          lidRef.current = child;
        }
        if (!child.isMesh) return;
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.envMapIntensity = 1.5;
          child.material.needsUpdate = true;
        }
      });

      /* 置中模型 */
      const box = new THREE.Box3().setFromObject(model);
      modelSizeRef.current = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);

      /* 記錄上蓋靜止 Y（置中後） */
      if (lidRef.current) {
        lidRestYRef.current = lidRef.current.position.y;
      }

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
      /* 清空 refs，讓新 effect 重建 */
      cameraRef.current = null;
      modelRef.current = null;
      lidRef.current = null;
    };
  }, []);

  /* ── 鏡頭切換 ── */
  const goToView = useCallback((viewKey) => {
    const view = VIEWS[viewKey];
    if (!view) return;
    const camera = cameraRef.current;
    const model = modelRef.current;
    const lid = lidRef.current;
    const modelSize = modelSizeRef.current;
    if (!camera || !model) return;

    gsap.to(camera.position, {
      x: view.camera.x,
      y: view.camera.y,
      z: view.camera.z,
      duration: 1.4,
      ease: "power3.inOut",
      onUpdate: () => camera.lookAt(view.lookAt.x, view.lookAt.y, view.lookAt.z),
    });
    gsap.to(model.rotation, {
      x: view.modelRot.x,
      y: view.modelRot.y,
      z: view.modelRot.z,
      duration: 1.4,
      ease: "power3.inOut",
    });

    if (lid && modelSize) {
      const liftAmount = modelSize.y * 5;
      if (view.lidOpen) {
        gsap.to(lid.position, {
          y: lidRestYRef.current + liftAmount,
          duration: 1.6,
          ease: "power2.in",
        });
      } else {
        gsap.to(lid.position, {
          y: lidRestYRef.current,
          duration: 1.2,
          ease: "power3.out",
        });
      }
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
      className="relative h-screen w-full overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #0d0020 0%, #08001a 50%, #0a0015 100%)",
      }}
      aria-label="產品 3D 特寫互動展示"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 55%, rgba(120,60,200,0.18) 0%, transparent 70%)",
        }}
      />

      <div ref={containerRef} className="absolute inset-0 h-full w-full" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-4 pb-10 md:pb-12">
        <p className="text-[11px] tracking-[0.2em] text-purple-300/50 uppercase">
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
                    : "bg-[#1a0533]/70 border border-[#4C1D95]/50 text-[#C4B5FD] hover:bg-[#2e0f52]/80 hover:border-[#7C3AED]/60 backdrop-blur-sm shadow-[0_2px_12px_rgba(0,0,0,0.4)]",
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
