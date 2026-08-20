"use client";
// Scene Phase 4 : DPR par device, wrapper aria-hidden (contenu equivalent
// dans le DOM), reste identique a la 3.5.
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { CameraController } from "./CameraController";
import { Machine } from "./Machine";
import { StationHalos } from "@/three/showcase/StationHalos";
import { useStore } from "@/store/useStore";
import { useScrollStateNav } from "@/hooks/useScrollStateNav";

export default function Experience() {
  const isTransitioning = useStore((s) => s.isTransitioning);
  const machineMode = useStore((s) => s.machineMode);
  const currentState = useStore((s) => s.currentState);
  const activeHotspot = useStore((s) => s.activeHotspot);
  const isMobile = useStore((s) => s.isMobile);
  useScrollStateNav();
  const exploring = currentState === "product" || currentState === "world";
  const frameloop = isTransitioning || machineMode !== "idle" || exploring ? "always" : "demand";

  return (
    <div aria-hidden="true">
      <Canvas
        frameloop={frameloop}
        dpr={[1, isMobile ? 1.5 : 2]}
        camera={{ position: [0, 1.6, 12], fov: 40 }}
        shadows
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}
        onPointerMissed={(e) => {
          if ((e.target as HTMLElement | null)?.nodeName !== "CANVAS") return;
          if (activeHotspot) useStore.getState().setHotspot(null);
        }}
        style={{ position: "fixed", inset: 0 }}>
        <color attach="background" args={["#0a0f18"]} />
        <fog attach="fog" args={["#0a0f18", 16, 36]} />
        <ambientLight intensity={0.18} />
        <directionalLight
          position={[5, 8, 6]} intensity={2.0} castShadow
          shadow-mapSize={isMobile ? [1024, 1024] : [2048, 2048]} shadow-bias={-0.0002}
          shadow-camera-left={-8} shadow-camera-right={8}
          shadow-camera-top={8} shadow-camera-bottom={-2} />
        <directionalLight position={[-6, 4, -4]} intensity={0.7} color="#8ab4ff" />
        <Suspense fallback={null}>
          <Environment preset="warehouse" environmentIntensity={0.6} />
          <Machine />
          <StationHalos />
          <ContactShadows position={[0, 0.01, 0]} opacity={0.55} scale={20} blur={2.4} far={4.5} />
        </Suspense>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]} receiveShadow>
          <circleGeometry args={[16, 64]} />
          <meshStandardMaterial color="#0c1220" metalness={0.15} roughness={0.85} />
        </mesh>
        <gridHelper args={[28, 56, "#1b2a45", "#12203a"]} position={[0, 0.002, 0]} />
        <CameraController />
      </Canvas>
    </div>
  );
}
