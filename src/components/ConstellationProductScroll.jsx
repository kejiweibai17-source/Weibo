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

const MODEL_PATH = "/3d/sima.glb";
const CPS_MASK_BG = "/images/8041cae4-aad7-4ae2-bbcd-8eb6d2def921.png";
/** 完成整段動畫所需的滾動距離（以視窗高度為單位） */
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
      if (!section) return undefined;

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

      let model = null;
      let modelPivot = null;
      let modelSize = null;
      let lidPart = null;
      let bodyPart = null;
      const lidRestPosition = new THREE.Vector3();
      const lidRestQuaternion = new THREE.Quaternion();
      const separationAxis = new THREE.Vector3(0, 1, 0);
      let rafId = 0;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
      );
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });

      renderer.setClearColor(0x000000, 0);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      if ("outputEncoding" in renderer) {
        renderer.outputEncoding = THREE.LinearEncoding;
      } else if ("outputColorSpace" in renderer) {
        renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
      }

      renderer.toneMapping = THREE.NoToneMapping;
      renderer.toneMappingExposure = 1.0;

      modelContainerRef.current?.appendChild(renderer.domElement);
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

      modelPivot = new THREE.Group();
      scene.add(modelPivot);

      function cacheLidRestPose() {
        if (!model) return;
        lidPart = null;
        bodyPart = null;

        model.traverse((child) => {
          if (child.name === "上蓋") {
            lidPart = child;
            lidRestPosition.copy(child.position);
            lidRestQuaternion.copy(child.quaternion);
          }
          if (child.name === "主體22222") {
            bodyPart = child;
          }
        });

        if (lidPart && bodyPart) {
          separationAxis
            .copy(lidRestPosition)
            .sub(bodyPart.position)
            .normalize();
        } else {
          separationAxis.set(0, 1, 0);
        }
      }

      function updateLidSeparation(progress) {
        if (!lidPart || !modelSize) return;

        const liftStart = 0.35;
        const liftEnd = 0.78;
        const raw =
          progress < liftStart
            ? 0
            : progress > liftEnd
              ? 1
              : (progress - liftStart) / (liftEnd - liftStart);
        const liftT = raw * raw * (3 - 2 * raw);

        const liftAmount = modelSize.y * 3.2;

        lidPart.position
          .copy(lidRestPosition)
          .addScaledVector(separationAxis, liftAmount * liftT);
        lidPart.quaternion.copy(lidRestQuaternion);
      }

      function centerModelInPivot() {
        if (!model || !modelPivot) return;

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        modelPivot.position.set(0, 0, 0);
        modelPivot.rotation.set(0, 0, 0);
      }

      function setupModel() {
        if (!model || !modelSize) return;

        centerModelInPivot();
        cacheLidRestPose();

        const maxDim = Math.max(modelSize.x, modelSize.y, modelSize.z);
        const isMobile = window.innerWidth < 1000;
        const cameraDistance = isMobile ? 2.4 : 1.55;

        camera.position.set(0, 0, maxDim * cameraDistance);
        camera.lookAt(0, 0, 0);
      }

      new GLTFLoader().load(MODEL_PATH, (gltf) => {
        model = gltf.scene;
        finalizeSimaGlbModel(model);

        const box = new THREE.Box3().setFromObject(model);
        modelSize = box.getSize(new THREE.Vector3());

        modelPivot.add(model);
        cacheLidRestPose();
        setupModel();
      });

      function animate() {
        rafId = requestAnimationFrame(animate);
        renderer.render(scene, camera);
      }
      animate();

      function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        setupModel();
      }

      window.addEventListener("resize", handleResize);

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

          if (modelPivot) {
            const rotationProgress =
              progress < 0.05 ? 0 : (progress - 0.05) / 0.95;
            modelPivot.rotation.y = Math.PI * 3 * 4 * rotationProgress;
            updateLidSeparation(progress);
          }
        },
      });

      ScrollTrigger.refresh();

      return () => {
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(rafId);
        headerEnterTrigger.kill();
        pinTrigger.kill();
        renderer.dispose();
        if (scene.environment?.dispose) scene.environment.dispose();
        modelContainerRef.current?.replaceChildren();
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
