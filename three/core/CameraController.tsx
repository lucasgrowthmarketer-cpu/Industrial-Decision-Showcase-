"use client";
// CameraController : etats declaratifs + transitions GSAP, TDD section 10.
// Toute transition est interruptible : une nouvelle destination kill la timeline
// en cours et repart de la position actuelle.
import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import gsap from "gsap";
import { useStore } from "@/store/useStore";
import camConfig from "@/config/camera-states.json";

type CamState = {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  duration: number;
  mode: "cinematic" | "explore";
  constraints?: { minDistance: number; maxDistance: number; minPolar: number; maxPolar: number };
};

const STATES = camConfig.states as unknown as Record<string, CamState>;

export function CameraController() {
  const camera = useThree((s) => s.camera);
  const controls = useRef<OrbitControlsImpl>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const currentState = useStore((s) => s.currentState);
  const setTransitioning = useStore((s) => s.setTransitioning);

  useEffect(() => {
    const st = STATES[currentState];
    if (!st || !controls.current) return;
    tl.current?.kill();
    controls.current.enabled = false;
    setTransitioning(true);
    const cam = camera as import("three").PerspectiveCamera;
    tl.current = gsap.timeline({
      defaults: { duration: Math.max(st.duration, 0.01), ease: "power2.inOut" },
      onUpdate: () => { cam.updateProjectionMatrix(); controls.current?.update(); },
      onComplete: () => {
        setTransitioning(false);
        if (controls.current && st.mode === "explore") {
          const c = st.constraints;
          controls.current.enabled = true;
          if (c) {
            controls.current.minDistance = c.minDistance;
            controls.current.maxDistance = c.maxDistance;
            controls.current.minPolarAngle = c.minPolar;
            controls.current.maxPolarAngle = c.maxPolar;
          }
        }
      },
    });
    tl.current
      .to(cam.position, { x: st.position[0], y: st.position[1], z: st.position[2] }, 0)
      .to(controls.current.target, { x: st.target[0], y: st.target[1], z: st.target[2] }, 0)
      .to(cam, { fov: st.fov }, 0);
    return () => { tl.current?.kill(); };
  }, [currentState, camera, setTransitioning]);

  return <OrbitControls ref={controls} enabled={false} enablePan={false} makeDefault />;
}
