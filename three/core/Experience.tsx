"use client";
// Scene Phase 2 : clic hors machine ferme le focus hotspot (onPointerMissed).
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { CameraController } from "./CameraController";
import { Machine } from "./Machine";
import { useStore } from "@/store/useStore";
import { useScrollStateNav } from "@/hooks/useScrollStateNav";

export default function Experience() {
  const isTransitioning = useStore((s) => s.isTransitioning);
  const machineMode = useStore((s) => s.machineMode);
  const currentState = useStore((s) => s.currentState);
  const activeHotspot = useStore((s) => s.activeHotspot);
  useScrollStateNav();
  const exploring = currentState === "product" || currentState === "world";
  const frameloop = isTransitioning || machineMode !== "idle" || exploring ? "always" : "demand";

  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 2]}
      camera={{ position: [0, 1.6, 12], fov: 40 }}
      shadows
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}
      onPointerMissed={() => { if (activeHotspot) useStore.getState().setHotspot(null); }}
      style={{ position: "fixed", inset: 0 }}>
      <color attach="background" args={["#0a0f18"]} />
      <fog attach="fog" args={["#0a0f18", 15, 34]} />
      <ambientLight intensity={0.18} />
      <directionalLight
        position={[5, 8, 6]} intensity={2.0} castShadow
        shadow-mapSize={[2048, 2048]} shadow-bias={-0.0002}
        shadow-camera-left={-6} shadow-camera-right={6}
        shadow-camera-top={6} shadow-camera-bottom={-2} />
      <directionalLight position={[-6, 4, -4]} intensity={0.7} color="#8ab4ff" />
      <Suspense fallback={null}>
        <Environment preset="warehouse" environmentIntensity={0.6} />
        <Machine />
        <ContactShadows position={[0, 0.01, 0]} opacity={0.55} scale={16} blur={2.4} far={4.5} />
      </Suspense>
      <gridHelper args={[26, 52, "#1b2a45", "#12203a"]} position={[0, 0, 0]} />
      <CameraController />
    </Canvas>
  );
}
