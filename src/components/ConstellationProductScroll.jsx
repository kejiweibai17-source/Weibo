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
  resetSimaEnvCache,
  setupSimaScrollSceneEnvironment,
} from "@/lib/simaGlbMaterials";
import "./ConstellationProductScroll.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

const MODEL_PATH = "/3d/機身細節26.glb";
const CPS_MASK_BG = "/images/8041cae4-aad7-4ae2-bbcd-8eb6d2def921.png";
// 縮短總滾動距離讓整段更緊湊；動畫內容（遮罩揭露、標題滑動、分隔線、文字、旋轉、上蓋分離）全部保留，
// 只是把時間軸壓縮、拉近彼此的間距，減少「轉完之後還要滾很久才接到文字」的空白感
const SCROLL_VIEWPORT_HEIGHTS = 3;
const MOBILE_MQ = "(max-width: 768px)";
const MOBILE_MODEL_SCALE = 0.58;
const DESKTOP_MODEL_SCALE = 1;
const MOBILE_CAMERA_Z = 5.6;
const DESKTOP_CAMERA_Z = 4.8;

function isMobileViewport() {
  return typeof window !== "undefined" && window.matchMedia(MOBILE_MQ).matches;
}

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

function applyViewportLayout(camera, pivot, mobile) {
  const scale = mobile ? MOBILE_MODEL_SCALE : DESKTOP_MODEL_SCALE;
  pivot.scale.setScalar(scale);
  camera.position.set(0, 0.1, mobile ? MOBILE_CAMERA_Z : DESKTOP_CAMERA_Z);
  camera.lookAt(0, 0, 0);
}

function getOrCreateThreeScene(container) {
  if (_threeInstance && _threeInstance.container === container) {
    return _threeInstance;
  }

  if (_threeInstance) {
    _threeInstance.dispose();
  }

  const mobile = isMobileViewport();
  const w = container.clientWidth || window.innerWidth;
  const h = container.clientHeight || window.innerHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);

  const renderer = new THREE.WebGLRenderer({
    antialias: !mobile,
    alpha: true,
    powerPreference: mobile ? "low-power" : "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(w, h);
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 2),
  );
  renderer.shadowMap.enabled = !mobile;
  if (!mobile) {
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  if ("outputColorSpace" in renderer) {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  } else if ("outputEncoding" in renderer) {
    renderer.outputEncoding = THREE.sRGBEncoding;
  }

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  container.replaceChildren();
  container.appendChild(renderer.domElement);
  setupSimaScrollSceneEnvironment(renderer, scene);

  scene.add(new THREE.AmbientLight(0xffffff, mobile ? 0.95 : 0.7));

  const mainLight = new THREE.DirectionalLight(0xffffff, mobile ? 1.15 : 1.0);
  mainLight.position.set(1, 2, 3);
  mainLight.castShadow = !mobile;
  if (!mobile) {
    mainLight.shadow.bias = -0.001;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
  }
  scene.add(mainLight);

  if (!mobile) {
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-2, 0, -2);
    scene.add(fillLight);

    const keyRim = new THREE.DirectionalLight(0xf4f6f8, 0.65);
    keyRim.position.set(3, 4, 2);
    scene.add(keyRim);
  } else {
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.55);
    fillLight.position.set(-2, 0, -2);
    scene.add(fillLight);
  }

  const pivot = new THREE.Group();
  scene.add(pivot);
  applyViewportLayout(camera, pivot, mobile);

  const state = {
    modelSize: null,
    lidPart: null,
    lidParts: [],
    lidRestPosition: new THREE.Vector3(),
    lidRestQuaternion: new THREE.Quaternion(),
    lidRestPositions: [],
    lidRestQuaternions: [],
    lidReady: false,
    modelLoaded: false,
    needsRender: true,
    isVisible: true,
  };

  let rafId = 0;
  function animate() {
    rafId = requestAnimationFrame(animate);
    if (!state.isVisible || !state.needsRender) return;
    renderer.render(scene, camera);
    state.needsRender = false;
  }
  animate();

  function requestRender() {
    state.needsRender = true;
  }

  new GLTFLoader().load(MODEL_PATH, (gltf) => {
    if (state.modelLoaded) return;

    const model = gltf.scene;
    finalizeSimaGlbModel(model);

    const toRemove = [];
    model.traverse((child) => {
      const n = child.name ?? "";
      const m = child.material?.name ?? "";
      if (m === "背景" || n.includes("背景")) toRemove.push(child);
      if (mobile && child.isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
    toRemove.forEach((obj) => obj.parent?.remove(obj));

    model.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(model);
    state.modelSize = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    model.position.set(-center.x, -center.y, -center.z);

    /* 自動偵測外蓋節點（GLB 為簡體「盖子」；不要移動「盖子内部」刀頭組） */
    const LID_EXACT_NAMES = new Set([
      "盖子",
      "蓋子",
      "蓋子.001",
      "盖子.001",
      "上蓋",
      "上盖",
    ]);
    const LID_EXCLUDE = [
      "封顶",
      "平滑",
      "按钮",
      "刀",
      "支架",
      "底托",
      "链接",
      "logo",
      "icon",
      "object_",
      "内部",
      "內部",
    ];

    function isExcludedName(name) {
      return LID_EXCLUDE.some((hint) => name.includes(hint));
    }

    function findLidParts(root) {
      const parts = [];
      let fuzzy = null;

      root.traverse((child) => {
        const name = child.name ?? "";
        if (!name || child.type === "Scene") return;

        if (LID_EXACT_NAMES.has(name)) {
          parts.push(child);
          return;
        }

        if (!fuzzy && !isExcludedName(name)) {
          if (/^盖子$|^蓋子$/i.test(name)) {
            fuzzy = child;
          } else if (/^lid$/i.test(name) || /^cover$/i.test(name)) {
            fuzzy = child;
          }
        }
      });

      if (parts.length) return parts;
      return fuzzy ? [fuzzy] : [];
    }

    const lidParts = findLidParts(model);
    state.lidParts = lidParts;
    state.lidRestPositions = lidParts.map((part) => part.position.clone());
    state.lidRestQuaternions = lidParts.map((part) => part.quaternion.clone());
    state.lidReady = lidParts.length > 0;
    state.lidPart = lidParts[0] || null;

    pivot.add(model);
    state.modelLoaded = true;
    requestRender();
  });

  function handleResize() {
    const rw = container.clientWidth || window.innerWidth;
    const rh = container.clientHeight || window.innerHeight;
    const nextMobile = isMobileViewport();
    camera.aspect = rw / rh;
    camera.updateProjectionMatrix();
    renderer.setSize(rw, rh);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, nextMobile ? 1.25 : 2),
    );
    applyViewportLayout(camera, pivot, nextMobile);
    requestRender();
  }
  window.addEventListener("resize", handleResize, { passive: true });

  _threeInstance = {
    container,
    pivot,
    state,
    requestRender,
    setVisible(visible) {
      state.isVisible = visible;
      if (visible) requestRender();
    },
    dispose() {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
      renderer.dispose();
      if (scene.environment?.dispose) scene.environment.dispose();
      // 這個場景的 renderer 沒了，快取的環境貼圖也要跟著失效，
      // 不然下次頁面切回來、新 renderer 拿到舊 GL context 的貼圖就會渲染成一片黑
      resetSimaEnvCache();
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
      const mobile = isMobileViewport();
      const splits = [];

      const headerSplit = SplitText.create(header1TitleRef.current, {
        type: "chars",
        charsClass: "char",
      });
      splits.push(headerSplit);

      headerSplit.chars.forEach(
        (char) => (char.innerHTML = `<span>${char.innerHTML}</span>`),
      );

      const headerChars = q(section, ".header-1 h1 .char > span");
      gsap.set(headerChars, { y: "100%" });

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

      const tooltipRevealSets = [
        {
          // 產品定住、分隔線畫完後就馬上接文字，不留空白滾動區
          start: 0.42,
          end: 0.5,
          elements: [
            ...q(section, ".tooltip:nth-child(1) .eyebrow"),
            ...q(section, ".tooltip:nth-child(1) .title .line > span"),
            ...q(section, ".tooltip:nth-child(1) .description .line > span"),
          ],
        },
        {
          start: 0.64,
          end: 0.72,
          elements: [
            ...q(section, ".tooltip:nth-child(2) .eyebrow"),
            ...q(section, ".tooltip:nth-child(2) .title .line > span"),
            ...q(section, ".tooltip:nth-child(2) .description .line > span"),
          ],
        },
      ];

      const dividerEls = q(section, ".tooltip .divider");
      const allTooltipRevealEls = tooltipRevealSets.flatMap((s) => s.elements);

      function revealProgress(progress, start, end) {
        const t = gsap.utils.clamp(0, 1, (progress - start) / (end - start));
        return t * t * (3 - 2 * t);
      }

      function applyReveal(elements, progress, start, end) {
        if (!elements.length) return;
        const eased = revealProgress(progress, start, end);
        gsap.set(elements, {
          y: `${(1 - eased) * 125}%`,
          opacity: eased,
          visibility: eased > 0 ? "visible" : "hidden",
        });
      }

      gsap.set(allTooltipRevealEls, {
        y: "125%",
        opacity: 0,
        visibility: "hidden",
      });

      const headerEnterTrigger = ScrollTrigger.create({
        trigger: section,
        start: "75% bottom",
        onEnter: () =>
          gsap.to(headerChars, {
            y: "0%",
            duration: 1,
            ease: "power3.out",
            stagger: 0.025,
          }),
        onLeaveBack: () =>
          gsap.to(headerChars, {
            y: "100%",
            duration: 1,
            ease: "power3.out",
            stagger: 0.025,
          }),
      });

      function updateLidSeparation(progress) {
        const { state } = three;
        if (!state.lidReady || !state.lidParts?.length || !state.modelSize) return;

        const liftStart = 0.5;
        const liftEnd = 0.8;
        const raw =
          progress < liftStart
            ? 0
            : progress > liftEnd
              ? 1
              : (progress - liftStart) / (liftEnd - liftStart);
        const liftT = raw * raw * (3 - 2 * raw);
        const liftAmount = state.modelSize.y * 4.0;

        state.lidParts.forEach((lidPart, i) => {
          const restPos = state.lidRestPositions[i];
          const restQuat = state.lidRestQuaternions[i];
          if (!restPos || !restQuat) return;
          lidPart.position.set(
            restPos.x,
            restPos.y + liftAmount * liftT,
            restPos.z,
          );
          lidPart.quaternion.copy(restQuat);
        });
      }

      let lastProgress = -1;

      const pinTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${window.innerHeight * SCROLL_VIEWPORT_HEIGHTS}px`,
        pin: true,
        pinSpacing: true,
        // 手機用同步 scrub，避免 scrub:1 的追趕延遲造成卡頓感
        scrub: mobile ? true : 0.35,
        anticipatePin: 1,
        onUpdate: ({ progress }) => {
          if (Math.abs(progress - lastProgress) < 0.0005) return;
          lastProgress = progress;

          const headerProgress = Math.max(
            0,
            Math.min(1, (progress - 0.03) / 0.19),
          );
          gsap.set(header1Ref.current, {
            xPercent:
              progress < 0.03
                ? 0
                : progress > 0.22
                  ? -100
                  : -100 * headerProgress,
          });

          const maskSize =
            progress < 0.12
              ? 0
              : progress > 0.22
                ? 100
                : 100 * ((progress - 0.12) / 0.1);
          const clipPath = `circle(${maskSize}% at 50% 50%)`;

          if (maskBgRef.current) {
            maskBgRef.current.style.clipPath = clipPath;
          }
          if (maskGlassRef.current) {
            maskGlassRef.current.style.clipPath = clipPath;
          }

          const header2Progress = (progress - 0.1) / 0.22;
          const header2XPercent =
            progress < 0.1
              ? 100
              : progress > 0.32
                ? -200
                : 100 - 300 * header2Progress;
          gsap.set(header2Ref.current, { xPercent: header2XPercent });

          const scaleX =
            progress < 0.28
              ? 0
              : progress > 0.42
                ? 100
                : 100 * ((progress - 0.28) / 0.14);
          gsap.set(dividerEls, { scaleX: `${scaleX}%` });

          tooltipRevealSets.forEach(({ start, end, elements }) => {
            applyReveal(elements, progress, start, end);
          });

          const rotationProgress =
            progress < 0.03 ? 0 : (progress - 0.03) / 0.97;
          three.pivot.rotation.y = Math.PI * 12 * rotationProgress;
          updateLidSeparation(progress);
          three.requestRender();
        },
      });

      const visibilityObserver = new IntersectionObserver(
        ([entry]) => {
          three.setVisible(entry.isIntersecting);
        },
        { rootMargin: "20% 0px", threshold: 0 },
      );
      visibilityObserver.observe(section);

      ScrollTrigger.refresh();

      return () => {
        visibilityObserver.disconnect();
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
