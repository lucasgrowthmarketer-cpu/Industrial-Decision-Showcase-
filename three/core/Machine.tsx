"use client";
// ProductViewer : GLB + hotspots sur ancres + attenuation des groupes non
// selectionnes. Materiaux clones par mesh au chargement (les slots du GLB sont
// partages entre groupes, l'attenuation par groupe exige des instances).
import { useEffect, useMemo } from "react";
import { useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useStore } from "@/store/useStore";
import { track } from "@/lib/analytics";
import machineData from "@/config/machine.json";

const MODEL_URL = (process.env.NEXT_PUBLIC_ASSETS_BASE ?? "") + machineData.model.url;
const GROUP_OF: Record<string, string> = Object.fromEntries(
  machineData.hotspots.map((h) => [h.id, "grp_" + h.id])
);

export function Machine() {
  const { scene } = useGLTF(MODEL_URL);
  const activeHotspot = useStore((s) => s.activeHotspot);
  const setHotspot = useStore((s) => s.setHotspot);
  const setMachineRoot = useStore((s) => s.setMachineRoot);
  const currentState = useStore((s) => s.currentState);

  // clones de materiaux (une fois) + enregistrement de la racine
  useMemo(() => {
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && !m.userData.__cloned) {
        m.material = Array.isArray(m.material)
          ? m.material.map((mat) => mat.clone())
          : (m.material as THREE.Material).clone();
        m.userData.__cloned = true;
      }
    });
    return null;
  }, [scene]);
  useEffect(() => {
    setMachineRoot(scene);
    return () => setMachineRoot(null);
  }, [scene, setMachineRoot]);

  // attenuation des groupes non selectionnes
  useEffect(() => {
    const focusGroup = activeHotspot ? GROUP_OF[activeHotspot] : null;
    machineData.hotspots.forEach((h) => {
      const grp = scene.getObjectByName(GROUP_OF[h.id]);
      if (!grp) return;
      const dim = focusGroup !== null && GROUP_OF[h.id] !== focusGroup;
      grp.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh) return;
        const mats = Array.isArray(m.material) ? m.material : [m.material];
        mats.forEach((mat) => {
          mat.transparent = true;
          gsap.to(mat, { opacity: dim ? 0.22 : 1, duration: 0.5, ease: "power2.out" });
        });
      });
    });
    // le bati (grp_body) s'attenue aussi lors d'un focus
    const body = scene.getObjectByName("grp_body");
    body?.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const mats = Array.isArray(m.material) ? m.material : [m.material];
      mats.forEach((mat) => {
        mat.transparent = true;
        gsap.to(mat, { opacity: activeHotspot ? 0.35 : 1, duration: 0.5, ease: "power2.out" });
      });
    });
  }, [activeHotspot, scene]);

  const showHotspots = currentState === "product";

  return (
    <primitive object={scene}>
      {showHotspots && machineData.hotspots.map((h) => {
        const anchor = scene.getObjectByName(h.anchorName);
        if (!anchor) return null;
        return (
          <Html key={h.id} position={anchor.getWorldPosition(new THREE.Vector3())}
                center distanceFactor={6} style={{ pointerEvents: "auto" }} zIndexRange={[20, 0]}>
            <button
              className={"hotspot" + (activeHotspot === h.id ? " hotspot-active" : "")}
              onClick={() => {
                const next = activeHotspot === h.id ? null : h.id;
                setHotspot(next);
                if (next) track("hotspot_clicked", { id: next });
              }}
              aria-label={h.label}>
              +
            </button>
          </Html>
        );
      })}
    </primitive>
  );
}

useGLTF.preload(MODEL_URL);
