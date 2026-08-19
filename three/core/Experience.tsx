"use client";
// Scene minimale Phase 0/1 : environnement, lumieres, machine, camera a etats.
import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { CameraController } from "./CameraController";
import { Machine, MachineHandle } from "./Machine";
import { useStore } from "@/store/useStore";

export default function Experience() {
  const machineRef = useRef<MachineHandle>(null);
  const isTransitioning = useStore((s) => s.isTransitioning);
  const machineMode = useStore((s) => s.machineMode);
  // frameloop demand quand tout est au repos : gain batterie mobile (TDD section 14)
  const frameloop = isTransitioning || machineMode !== "idle" ? "always" : "demand";

  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 2]}
      camera={{ position: [0, 1.6, 12], fov: 40 }}
      shadows
      gl={{ antialias: true }}
      style={{ position: "fixed", inset: 0 }}>
      <color attach="background" args={["#0a0f18"]} />
      <fog attach="fog" args={["#0a0f18", 14, 30]} />
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[5, 8, 6]} intensity={1.6} castShadow
        shadow-mapSize={[2048, 2048]} shadow-bias={-0.0002} />
      <directionalLight position={[-6, 4, -4]} intensity={0.5} color="#8ab4ff" />
      <Suspense fallback={null}>
        <Environment preset="warehouse" environmentIntensity={0.35} />
        <Machine ref={machineRef} />
        <ContactShadows position={[0, 0.01, 0]} opacity={0.5} scale={14} blur={2.2} far={4} />
      </Suspense>
      <gridHelper args={[24, 48, "#1b2a45", "#12203a"]} position={[0, 0, 0]} />
      <CameraController />
    </Canvas>
  );
}
