"use client";
// CameraController : etats declaratifs + focus hotspot derive des ancres du GLB.
import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import gsap from "gsap";
import { useStore } from "@/store/useStore";
import camConfig from "@/config/camera-states.json";
import machineData from "@/config/machine.json";

type CamState = {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  duration: number;
  mode: "cinematic" | "explore";
  constraints?: { minDistance: number; maxDistance: number; minPolar: number; maxPolar: number };
};

const STATES = camConfig.states as unknown as Record<string, CamState>;
const HOTSPOT_OFFSET = camConfig.hotspotOffsets.default;

export function CameraController() {
  const camera = useThree((s) => s.camera);
  const controls = useRef<OrbitControlsImpl>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const currentState = useStore((s) => s.currentState);
  const activeHotspot = useStore((s) => s.activeHotspot);
  const machineRoot = useStore((s) => s.machineRoot);
  const setTransitioning = useStore((s) => s.setTransitioning);

  const flyTo = (pos: THREE.Vector3, target: THREE.Vector3, fov: number, duration: number, thenExplore?: CamState["constraints"]) => {
    if (!controls.current) return;
    tl.current?.kill();
    controls.current.enabled = false;
    setTransitioning(true);
    const cam = camera as THREE.PerspectiveCamera;
    tl.current = gsap.timeline({
      defaults: { duration: Math.max(duration, 0.01), ease: "power2.inOut" },
      onUpdate: () => { cam.updateProjectionMatrix(); controls.current?.update(); },
      onComplete: () => {
        setTransitioning(false);
        if (controls.current && thenExplore) {
          controls.current.enabled = true;
          controls.current.minDistance = thenExplore.minDistance;
          controls.current.maxDistance = thenExplore.maxDistance;
          controls.current.minPolarAngle = thenExplore.minPolar;
          controls.current.maxPolarAngle = thenExplore.maxPolar;
        }
      },
    });
    tl.current
      .to(cam.position, { x: pos.x, y: pos.y, z: pos.z }, 0)
      .to(controls.current.target, { x: target.x, y: target.y, z: target.z }, 0)
      .to(cam, { fov }, 0);
  };

  // transitions d'etats
  useEffect(() => {
    const st = STATES[currentState];
    if (!st) return;
    flyTo(new THREE.Vector3(...st.position), new THREE.Vector3(...st.target), st.fov, st.duration,
          st.mode === "explore" ? st.constraints : undefined);
    return () => { tl.current?.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentState]);

  // focus hotspot : position derivee de l'ancre + offsets (zero coordonnee en dur)
  useEffect(() => {
    if (!machineRoot) return;
    if (!activeHotspot) {
      if (currentState === "product") {
        const st = STATES.product;
        flyTo(new THREE.Vector3(...st.position), new THREE.Vector3(...st.target), st.fov, 1.0, st.constraints);
      }
      return;
    }
    const h = machineData.hotspots.find((x) => x.id === activeHotspot);
    const anchor = h && machineRoot.getObjectByName(h.anchorName);
    if (!anchor) return;
    const target = anchor.getWorldPosition(new THREE.Vector3());
    const center = new THREE.Vector3(0, target.y, 0);
    const dir = target.clone().sub(center).setY(0);
    if (dir.lengthSq() < 0.01) dir.set(0, 0, 1);
    dir.normalize();
    const pos = target.clone()
      .add(dir.multiplyScalar(HOTSPOT_OFFSET.distance))
      .add(new THREE.Vector3(0, HOTSPOT_OFFSET.height + 0.3, HOTSPOT_OFFSET.distance * 0.55));
    flyTo(pos, target, 36, 1.1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHotspot, machineRoot]);

  return <OrbitControls ref={controls} enabled={false} enablePan={false} makeDefault />;
}
