"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import gsap from "gsap";

const MODEL_PATH = "/3d/特寫.glb";

const SLIDES = [
  {
    id: 1,
    title: "磁吸防塵保護蓋",
    subtitle: "上蓋特寫",
    desc: "磁吸式上蓋一貼即合，隔絕灰塵、守護刀頭，收納潔淨衛生。",
    info: {
      target: "S3 旗艦版刮鬍刀",
      feature: "磁吸防塵保護蓋",
      structure: "一貼即合",
      material: "鋅合金壓鑄",
    },
    camera: { x: 0.3, y: 1.2, z: 1.8 },
    lookAt: { x: 0, y: 0.4, z: 0 },
    modelRotation: { x: -Math.PI * 0.12, y: -Math.PI * 0.08, z: 0 },
  },
  {
    id: 2,
    title: "專利防水推式開關",
    subtitle: "開關結構特寫",
    desc: "獨家專利設計的防水推式開關，輕推即開、回彈即關，確保 IPX7 全機防水。每一次操作都是對工藝極致的體現。",
    info: {
      target: "S3 旗艦版刮鬍刀",
      feature: "專利推式結構",
      waterproof: "IPX7 全機防水",
      operation: "輕推即開",
    },
    camera: { x: 1.8, y: 0.2, z: 1.5 },
    lookAt: { x: 0, y: -0.1, z: 0 },
    modelRotation: { x: 0.05, y: -Math.PI * 0.45, z: 0 },
  },
  {
    id: 3,
    title: "開放式雙環刀網",
    subtitle: "素材2.0刀頭",
    desc: "開放式雙環結構精準導入鬍鬚，捕鬚更全面、刮除更高效。",
    info: {
      target: "S3 旗艦版刮鬍刀",
      feature: "開放式雙環刀網",
      blade: "雙環超薄刀網",
      design: "精準捕鬚",
    },
    camera: { x: 0.3, y: 2.8, z: 1.2 },
    lookAt: { x: 0, y: 0.5, z: 0 },
    modelRotation: { x: -Math.PI * 0.35, y: Math.PI * 0.1, z: 0 },
    lidOpen: true,
  },
];

const INFO_LABELS = {
  target: "適用機型",
  feature: "核心功能",
  waterproof: "防水等級",
  material: "機身材質",
  structure: "磁吸結構",
  operation: "操作方式",
  blade: "刀網規格",
  design: "設計理念",
};

export default function InteractiveExplorer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const modelRef = useRef(null);
  const rafRef = useRef(null);
  const lidRef = useRef(null);
  const lidRestPosRef = useRef(new THREE.Vector3());
  const modelSizeRef = useRef(null);

  const currentData = SLIDES[currentIndex];

  const animateCamera = useCallback(
    (slide) => {
      const camera = cameraRef.current;
      const model = modelRef.current;
      const lid = lidRef.current;
      if (!camera || !model) return;

      gsap.to(camera.position, {
        x: slide.camera.x,
        y: slide.camera.y,
        z: slide.camera.z,
        duration: 1.4,
        ease: "power3.inOut",
        onUpdate: () => {
          camera.lookAt(slide.lookAt.x, slide.lookAt.y, slide.lookAt.z);
        },
      });

      gsap.to(model.rotation, {
        x: slide.modelRotation.x,
        y: slide.modelRotation.y,
        z: slide.modelRotation.z,
        duration: 1.4,
        ease: "power3.inOut",
      });

      if (lid && modelSizeRef.current) {
        const liftAmount = modelSizeRef.current.y * 5;
        if (slide.lidOpen) {
          gsap.to(lid.position, {
            y: lidRestPosRef.current.y + liftAmount,
            duration: 1.6,
            ease: "power2.in",
          });
        } else {
          gsap.to(lid.position, {
            y: lidRestPosRef.current.y,
            duration: 1.2,
            ease: "power3.out",
          });
        }
      }
    },
    [],
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0c);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      100,
    );
    camera.position.set(
      SLIDES[0].camera.x,
      SLIDES[0].camera.y,
      SLIDES[0].camera.z,
    );
    camera.lookAt(SLIDES[0].lookAt.x, SLIDES[0].lookAt.y, SLIDES[0].lookAt.z);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight,
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    if ("outputColorSpace" in renderer) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    }
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(2, 3, 4);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-3, 1, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xd4e0ff, 0.5);
    rimLight.position.set(0, 4, -3);
    scene.add(rimLight);

    new GLTFLoader().load(MODEL_PATH, (gltf) => {
      const model = gltf.scene;
      modelRef.current = model;

      model.traverse((child) => {
        if (child.name === "上蓋" || child.name.includes("上蓋")) {
          lidRef.current = child;
          lidRestPosRef.current.copy(child.position);
        }

        if (!child.isMesh) return;
        const meshName = child.name ?? "";
        const matName = child.material?.name ?? "";

        if (matName === "背景" || meshName.includes("背景")) {
          child.visible = false;
          return;
        }
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          child.material.envMapIntensity = 1.5;
          child.material.needsUpdate = true;
        }
      });

      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      modelSizeRef.current = size;
      model.position.sub(center);

      scene.add(model);
    });

    function animate() {
      rafRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    function handleResize() {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      if (scene.environment?.dispose) scene.environment.dispose();
      containerRef.current?.replaceChildren();
    };
  }, []);

  useEffect(() => {
    animateCamera(SLIDES[currentIndex]);
  }, [currentIndex, animateCamera]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  return (
    <div className="relative w-full h-screen bg-[#0a0a0c] overflow-hidden font-sans select-none flex items-center justify-center">
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      <div className="absolute inset-0 z-20 p-6 md:p-12 flex flex-col justify-end pointer-events-none">
        <div className="w-full flex justify-between items-end">
          <motion.div
            className="pointer-events-auto w-[340px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="p-4 border-b border-white/10 bg-white/5">
              <h3 className="text-white text-sm font-bold tracking-widest">
                產品資訊
              </h3>
            </div>

            <div className="p-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentData.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-4">
                    <p className="text-gray-500 text-xs tracking-wider mb-1">
                      {INFO_LABELS.target}
                    </p>
                    <p className="text-white text-lg">
                      {currentData.info.target}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                    {Object.entries(currentData.info)
                      .slice(1)
                      .map(([key, value]) => (
                        <div key={key}>
                          <p className="text-gray-500 text-[10px] tracking-wider mb-1">
                            {INFO_LABELS[key] ?? key}
                          </p>
                          <p className="text-gray-200 text-sm font-medium">
                            {value}
                          </p>
                        </div>
                      ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex border-t border-white/10 bg-black/20">
              <button
                onClick={prevSlide}
                className="flex-1 py-4 flex justify-center items-center gap-2 text-gray-400 hover:text-white hover:bg-white/5 transition-colors border-r border-white/10"
              >
                <ChevronLeft size={16} />
                <span className="text-sm font-medium">上一個</span>
              </button>
              <button
                onClick={nextSlide}
                className="flex-1 py-4 flex justify-center items-center gap-2 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <span className="text-sm font-medium">下一個</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentData.id}
              initial={{ opacity: 0, x: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -30, filter: "blur(8px)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none w-[320px] text-right"
            >
              <p className="text-gray-500 text-xs tracking-widest mb-2 uppercase">
                {currentData.subtitle}
              </p>
              <h2 className="text-white text-2xl font-bold mb-3 tracking-wide">
                {currentData.title}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                {currentData.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute top-6 right-6 md:top-12 md:right-12 z-20 flex gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => setCurrentIndex(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? "bg-white scale-110"
                : "bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
