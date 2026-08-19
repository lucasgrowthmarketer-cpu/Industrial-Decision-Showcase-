"use client";
// ProductViewer minimal : charge le GLB, expose la racine au parent via ref,
// hotspots positionnes sur les ancres du fichier (zero coordonnee hardcodee).
import { forwardRef, useImperativeHandle, useRef } from "react";
import { useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "@/store/useStore";
import machineData from "@/config/machine.json";

const MODEL_URL = (process.env.NEXT_PUBLIC_ASSETS_BASE ?? "") + machineData.model.url;

export type MachineHandle = { root: THREE.Object3D | null };

export const Machine = forwardRef<MachineHandle>(function Machine(_, ref) {
  const { scene } = useGLTF(MODEL_URL);
  const rootRef = useRef<THREE.Object3D>(scene);
  useImperativeHandle(ref, () => ({ root: rootRef.current }));
  const activeHotspot = useStore((s) => s.activeHotspot);
  const setHotspot = useStore((s) => s.setHotspot);
  const currentState = useStore((s) => s.currentState);

  const showHotspots = currentState === "product";

  return (
    <primitive object={scene}>
      {showHotspots && machineData.hotspots.map((h) => {
        const anchor = scene.getObjectByName(h.anchorName);
        if (!anchor) return null;
        return (
          <Html key={h.id} position={anchor.getWorldPosition(new THREE.Vector3())}
                center distanceFactor={6} style={{ pointerEvents: "auto" }}>
            <button
              className={"hotspot" + (activeHotspot === h.id ? " hotspot-active" : "")}
              onClick={() => setHotspot(activeHotspot === h.id ? null : h.id)}
              aria-label={h.label}>
              +
            </button>
          </Html>
        );
      })}
    </primitive>
  );
});

useGLTF.preload(MODEL_URL);
