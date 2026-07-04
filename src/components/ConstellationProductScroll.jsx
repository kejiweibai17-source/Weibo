"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  finalizeSimaGlbModel,
  setupSimaScrollSceneEnvironment,
} from "@/lib/simaGlbMaterials";
import "./ConstellationProductScroll.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

const MODEL_PATH = "/3d/星座.glb";
const CPS_MASK_BG = "/images/8041cae4-aad7-4ae2-bbcd-8eb6d2def921.png";
const SCROLL_VIEWPORT_HEIGHTS = 5;

const CPS_TOOLTIPS = [
  {
    eyebrow: "SMASMALL 昔馬 · Four Elements",
    title: "星座系列電動刮鬍刀禮盒",
    description: "火 · 風 · 土 · 水　四象限定",
  },
  {
    eyebrow: "SMASMALL 昔馬",
    title: "為俐落而生",
    description: "磁吸快拆刀網 · 德國進口鍍鋼刀片 · IPX7 全機防水",
  },
];

function q(section, selector) {
  return section.querySelectorAll(selector);
}

let _threeInstance = null;

function getOrCreateThreeScene(container) {
  if (_threeInstance && _threeInstance.container === container) {
    return _threeInstance;
  }

  if (_threeInstance) {
    _threeInstance.dispose();
  }

  const w = container.clientWidth || window.innerWidth;
  const h = container.clientHeight || window.innerHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
  camera.position.set(0, 0.1, 4.8);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  if ("outputColorSpace" in renderer) {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  } else if ("outputEncoding" in renderer) {
    renderer.outputEncoding = THREE.sRGBEncoding;
  }

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  container.replaceChildren();
  container.appendChild(renderer.domElement);
  setupSimaScrollSceneEnvironment(renderer, scene);

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
  mainLight.position.set(1, 2, 3);
  mainLight.castShadow = true;
  mainLight.shadow.bias = -0.001;
  mainLight.shadow.mapSize.width = 1024;
  mainLight.shadow.mapSize.height = 1024;
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
  fillLight.position.set(-2, 0, -2);
  scene.add(fillLight);

  const keyRim = new THREE.DirectionalLight(0xf4f6f8, 0.65);
  keyRim.position.set(3, 4, 2);
  scene.add(keyRim);

  const pivot = new THREE.Group();
  scene.add(pivot);

  const state = {
    modelSize: null,
    lidPart: null,
    lidRestPosition: new THREE.Vector3(),
    lidRestQuaternion: new THREE.Quaternion(),
    lidReady: false,
    modelLoaded: false,
  };

  let rafId = 0;
  function animate() {
    rafId = requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  new GLTFLoader().load(MODEL_PATH, (gltf) => {
    if (state.modelLoaded) return;

    const model = gltf.scene;
    finalizeSimaGlbModel(model);

    const toRemove = [];
    model.traverse((child) => {
      const n = child.name ?? "";
      const m = child.material?.name ?? "";
      if (m === "背景" || n.includes("背景")) toRemove.push(child);
    });
    toRemove.forEach((obj) => obj.parent?.remove(obj));

    model.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(model);
    state.modelSize = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    model.position.set(-center.x, -center.y, -center.z);

    model.traverse((child) => {
      if (child.name === "上蓋") state.lidPart = child;
    });

    if (state.lidPart) {
      state.lidRestPosition.copy(state.lidPart.position);
      state.lidRestQuaternion.copy(state.lidPart.quaternion);
      state.lidReady = true;
    }

    pivot.add(model);
    state.modelLoaded = true;
  });

  function handleResize() {
    const rw = container.clientWidth || window.innerWidth;
    const rh = container.clientHeight || window.innerHeight;
    camera.aspect = rw / rh;
    camera.updateProjectionMatrix();
    renderer.setSize(rw, rh);
  }
  window.addEventListener("resize", handleResize);

  _threeInstance = {
    container,
    pivot,
    state,
    dispose() {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
      renderer.dispose();
      if (scene.environment?.dispose) scene.environment.dispose();
      container.replaceChildren();
      _threeInstance = null;
    },
  };

  return _threeInstance;
}

export default function ConstellationProductScroll() {
  const sectionRef = useRef(null);
  const header1Ref = useRef(null);
  const header2Ref = useRef(null);
  const header1TitleRef = useRef(null);
  const maskBgRef = useRef(null);
  const maskGlassRef = useRef(null);
  const modelContainerRef = useRef(null);

  useLenis(() => {
    ScrollTrigger.update();
  });

  useGSAP(
    () => {
      const section = sectionRef.current;
      const container = modelContainerRef.current;
      if (!section || !container) return undefined;

      const three = getOrCreateThreeScene(container);

      const splits = [];

      const headerSplit = SplitText.create(header1TitleRef.current, {
        type: "chars",
        charsClass: "char",
      });
      splits.push(headerSplit);

      headerSplit.chars.forEach(
        (char) => (char.innerHTML = `<span>${char.innerHTML}</span>`),
      );

      gsap.set(q(section, ".header-1 h1 .char > span"), { y: "100%" });

      const titleSplits = SplitText.create(".tooltip .title h2", {
        type: "lines",
        linesClass: "line",
      });
      const descriptionSplits = SplitText.create(".tooltip .description p", {
        type: "lines",
        linesClass: "line",
      });
      splits.push(titleSplits, descriptionSplits);

      [...titleSplits.lines, ...descriptionSplits.lines].forEach(
        (line) => (line.innerHTML = `<span>${line.innerHTML}</span>`),
      );

      const tooltipTextReveals = [
        {
          start: 0.65,
          end: 0.72,
          elements: [
            ".tooltip:nth-child(1) .eyebrow",
            ".tooltip:nth-child(1) .title .line > span",
            ".tooltip:nth-child(1) .description .line > span",
          ],
        },
        {
          start: 0.85,
          end: 0.9,
          elements: [
            ".tooltip:nth-child(2) .eyebrow",
            ".tooltip:nth-child(2) .title .line > span",
            ".tooltip:nth-child(2) .description .line > span",
          ],
        },
      ];

      function revealProgress(progress, start, end) {
        const t = gsap.utils.clamp(0, 1, (progress - start) / (end - start));
        return t * t * (3 - 2 * t);
      }

      function applyReveal(elements, progress, start, end) {
        const eased = revealProgress(progress, start, end);
        gsap.set(elements, {
          y: `${(1 - eased) * 125}%`,
          opacity: eased,
          visibility: eased > 0 ? "visible" : "hidden",
        });
      }

      gsap.set(
        [
          ...q(section, ".tooltip .eyebrow"),
          ...q(section, ".tooltip .title .line > span"),
          ...q(section, ".tooltip .description .line > span"),
        ],
        { y: "125%", opacity: 0, visibility: "hidden" },
      );

      const headerEnterTrigger = ScrollTrigger.create({
        trigger: section,
        start: "75% bottom",
        onEnter: () =>
          gsap.to(q(section, ".header-1 h1 .char > span"), {
            y: "0%",
            duration: 1,
            ease: "power3.out",
            stagger: 0.025,
          }),
        onLeaveBack: () =>
          gsap.to(q(section, ".header-1 h1 .char > span"), {
            y: "100%",
            duration: 1,
            ease: "power3.out",
            stagger: 0.025,
          }),
      });

      function updateLidSeparation(progress) {
        const { state } = three;
        if (!state.lidReady || !state.lidPart || !state.modelSize) return;

        const liftStart = 0.3;
        const liftEnd = 0.7;
        const raw =
          progress < liftStart
            ? 0
            : progress > liftEnd
              ? 1
              : (progress - liftStart) / (liftEnd - liftStart);
        const liftT = raw * raw * (3 - 2 * raw);

        const liftAmount = state.modelSize.y * 4.0;

        state.lidPart.position.set(
          state.lidRestPosition.x,
          state.lidRestPosition.y + liftAmount * liftT,
          state.lidRestPosition.z,
        );
        state.lidPart.quaternion.copy(state.lidRestQuaternion);
      }

      const pinTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${window.innerHeight * SCROLL_VIEWPORT_HEIGHTS}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: ({ progress }) => {
          const headerProgress = Math.max(
            0,
            Math.min(1, (progress - 0.05) / 0.3),
          );
          gsap.set(header1Ref.current, {
            xPercent:
              progress < 0.05
                ? 0
                : progress > 0.35
                  ? -100
                  : -100 * headerProgress,
          });

          const maskSize =
            progress < 0.2
              ? 0
              : progress > 0.3
                ? 100
                : 100 * ((progress - 0.2) / 0.1);
          const clipPath = `circle(${maskSize}% at 50% 50%)`;

          if (maskBgRef.current) {
            gsap.set(maskBgRef.current, { clipPath });
          }
          if (maskGlassRef.current) {
            gsap.set(maskGlassRef.current, { clipPath });
          }

          const header2Progress = (progress - 0.15) / 0.35;
          const header2XPercent =
            progress < 0.15
              ? 100
              : progress > 0.5
                ? -200
                : 100 - 300 * header2Progress;
          gsap.set(header2Ref.current, { xPercent: header2XPercent });

          const scaleX =
            progress < 0.45
              ? 0
              : progress > 0.65
                ? 100
                : 100 * ((progress - 0.45) / 0.2);
          gsap.set(q(section, ".tooltip .divider"), {
            scaleX: `${scaleX}%`,
          });

          tooltipTextReveals.forEach(({ start, end, elements }) => {
            applyReveal(q(section, elements.join(", ")), progress, start, end);
          });

          const rotationProgress =
            progress < 0.05 ? 0 : (progress - 0.05) / 0.95;
          three.pivot.rotation.y = Math.PI * 3 * 4 * rotationProgress;
          updateLidSeparation(progress);
        },
      });

      ScrollTrigger.refresh();

      return () => {
        headerEnterTrigger.kill();
        pinTrigger.kill();
        splits.forEach((split) => split.revert?.());
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="cps-section product-overview"
      aria-label="昔馬電動刮鬍刀產品展示"
    >
      <div
        ref={maskBgRef}
        className="circular-mask-bg"
        style={{ backgroundImage: `url(${CPS_MASK_BG})` }}
        aria-hidden
      />
      <div ref={maskGlassRef} className="circular-mask-glass" aria-hidden />

      <div ref={header1Ref} className="header-1">
        <h1 ref={header1TitleRef}>Every Morning Starts With</h1>
      </div>

      <div ref={header2Ref} className="header-2">
        <h1>SMASMALL Shaver</h1>
      </div>

      <div className="tooltips">
        {CPS_TOOLTIPS.map(({ eyebrow, title, description }) => (
          <div key={title} className="tooltip">
            <p className="eyebrow">{eyebrow}</p>
            <div className="divider" />
            <div className="title">
              <h2>{title}</h2>
            </div>
            <div className="description">
              <p>{description}</p>
            </div>
          </div>
        ))}
      </div>

      <div ref={modelContainerRef} className="model-container" aria-hidden />
    </section>
  );
}
