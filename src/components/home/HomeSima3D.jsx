"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  useGLTF,
  Center,
  ContactShadows,
  Bounds,
  Environment,
  Lightformer,
  OrbitControls,
  Html,
  useProgress,
} from "@react-three/drei";
import * as THREE from "three";
import { finalizeSimaGlbModel } from "@/lib/simaGlbMaterials";

const MODEL_PATH = "/3d/星座.glb";

useGLTF.preload(MODEL_PATH);

function EnvMapSync({ model }) {
  const { scene } = useThree();

  useEffect(() => {
    if (!model || !scene.environment) return;

    model.traverse((child) => {
      if (!child.isMesh || !child.material) return;
      const m = child.material;
      m.envMapIntensity = m.envMapIntensity ?? 1.5;
      m.needsUpdate = true;
    });
  }, [model, scene.environment]);

  return null;
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <p className="text-sm tracking-[0.15em] text-neutral-500">
        載入 3D 模型 {progress.toFixed(0)}%
      </p>
    </Html>
  );
}

function SimaModel() {
  const { scene } = useGLTF(MODEL_PATH);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    finalizeSimaGlbModel(clone);
    return clone;
  }, [scene]);

  return (
    <>
      <EnvMapSync model={model} />
      <Bounds fit clip observe margin={1.1}>
        <Center>
          <primitive object={model} />
        </Center>
      </Bounds>
    </>
  );
}

function SceneLighting() {
  return (
    <>
      <Environment resolution={768} environmentIntensity={1.05} preset="studio">
        <Lightformer
          intensity={3}
          rotation-x={Math.PI / 2}
          position={[0, 5, -3]}
          scale={[14, 14, 1]}
          color="#ffffff"
        />
        <Lightformer
          intensity={1.8}
          rotation-y={Math.PI / 2}
          position={[-5, 1, 1]}
          scale={[10, 5, 1]}
          color="#f0f4f8"
        />
        <Lightformer
          intensity={1.5}
          rotation-y={-Math.PI / 2}
          position={[5, 2, 0]}
          scale={[8, 4, 1]}
          color="#e8ecf0"
        />
        <Lightformer
          intensity={0.9}
          position={[0, -2, 4]}
          scale={[12, 2, 1]}
          color="#dfe3e8"
        />
      </Environment>

      <ambientLight intensity={0.65} color="#ffffff" />
      <hemisphereLight
        args={["#ffffff", "#d8dce2", 0.55]}
        position={[0, 1, 0]}
      />
      <directionalLight position={[4, 8, 6]} intensity={0.42} color="#ffffff" />
      <directionalLight
        position={[-5, 4, 3]}
        intensity={0.22}
        color="#eef1f5"
      />
    </>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#ffffff"]} />
      <SceneLighting />
      <SimaModel />
      <ContactShadows
        position={[0, -0.48, 0]}
        opacity={0.22}
        scale={14}
        blur={2.8}
        far={5}
        color="#9ca3af"
      />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.06}
        minDistance={2.2}
        maxDistance={9}
        maxPolarAngle={Math.PI * 0.88}
        minPolarAngle={Math.PI * 0.22}
        enablePan={false}
      />
    </>
  );
}

export default function HomeSima3D() {
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) setWebglOk(false);
    } catch {
      setWebglOk(false);
    }
  }, []);

  return (
    <section
      className="relative w-full bg-white text-neutral-900"
      aria-label="SMASMALL 3D 產品展示"
    >
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:w-[38%] lg:py-0 lg:pl-16">
          <p className="mb-2 text-xs tracking-[0.35em] text-[#ea580c] uppercase">
            Interactive 3D
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            360° 探索昔馬產品
          </h2>
          <p className="mt-4 max-w-sm text-sm text-neutral-500">
            拖曳旋轉檢視 · 太空灰消光金屬機身 · 鏡面上蓋
          </p>
        </div>

        <div className="relative min-h-[70vh] flex-1 lg:min-h-screen">
          {!webglOk ? (
            <div className="flex h-full min-h-[50vh] items-center justify-center px-6 text-center text-sm text-neutral-500">
              此裝置不支援 WebGL，無法顯示 3D 模型。
            </div>
          ) : (
            <Canvas
              dpr={[1, 2]}
              gl={{
                antialias: true,
                alpha: false,
                outputColorSpace: THREE.SRGBColorSpace,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1,
              }}
              camera={{
                position: [0, 0.15, 4.4],
                fov: 38,
                near: 0.1,
                far: 100,
              }}
              className="h-full min-h-[70vh] w-full touch-none lg:min-h-screen"
            >
              <Suspense fallback={<Loader />}>
                <Scene />
              </Suspense>
            </Canvas>
          )}
        </div>
      </div>
    </section>
  );
}
