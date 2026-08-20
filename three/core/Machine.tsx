"use client";
// ProductViewer Phase 4 : hover emissif sur les groupes, hotspots 3D desktop
// uniquement (chips HTML sur mobile), apparition en stagger.
import { useEffect, useMemo, useRef } from "react";
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
const HOVERABLE = new Set(Object.values(GROUP_OF));

function groupOf(o: THREE.Object3D | null): THREE.Object3D | null {
  let cur: THREE.Object3D | null = o;
  while (cur) {
    if (HOVERABLE.has(cur.name)) return cur;
    cur = cur.parent;
  }
  return null;
}

export function Machine() {
  const { scene } = useGLTF(MODEL_URL);
  const activeHotspot = useStore((s) => s.activeHotspot);
  const setHotspot = useStore((s) => s.setHotspot);
  const setMachineRoot = useStore((s) => s.setMachineRoot);
  const currentState = useStore((s) => s.currentState);
  const isMobile = useStore((s) => s.isMobile);
  const hovered = useRef<THREE.Object3D | null>(null);

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
    const setOpacity = (grp: THREE.Object3D, o: number) => {
      grp.traverse((obj) => {
        const m = obj as THREE.Mesh;
        if (!m.isMesh) return;
        const mats = Array.isArray(m.material) ? m.material : [m.material];
        mats.forEach((mat) => {
          mat.transparent = true;
          gsap.to(mat, { opacity: o, duration: 0.5, ease: "power2.out" });
        });
      });
    };
    machineData.hotspots.forEach((h) => {
      const grp = scene.getObjectByName(GROUP_OF[h.id]);
      if (grp) setOpacity(grp, focusGroup !== null && GROUP_OF[h.id] !== focusGroup ? 0.22 : 1);
    });
    const body = scene.getObjectByName("grp_body");
    if (body) setOpacity(body, activeHotspot ? 0.35 : 1);
  }, [activeHotspot, scene]);

  // hover emissif (desktop, etat product uniquement)
  const setEmissive = (grp: THREE.Object3D | null, k: number) => {
    grp?.traverse((obj) => {
      const m = obj as THREE.Mesh;
      if (!m.isMesh) return;
      const mats = Array.isArray(m.material) ? m.material : [m.material];
      mats.forEach((mat) => {
        const std = mat as THREE.MeshStandardMaterial;
        if (!std.emissive) return;
        std.emissive.set("#207bff");
        gsap.to(std, { emissiveIntensity: k, duration: 0.3 });
      });
    });
  };
  const onOver = (e: { object: THREE.Object3D; stopPropagation: () => void }) => {
    if (isMobile || currentState !== "product") return;
    e.stopPropagation();
    const grp = groupOf(e.object);
    if (grp === hovered.current) return;
    setEmissive(hovered.current, 0);
    hovered.current = grp;
    setEmissive(grp, 0.18);
    document.body.style.cursor = grp ? "pointer" : "default";
  };
  const onOut = () => {
    setEmissive(hovered.current, 0);
    hovered.current = null;
    document.body.style.cursor = "default";
  };
  const onClick = (e: { object: THREE.Object3D; stopPropagation: () => void }) => {
    if (currentState !== "product") return;
    const grp = groupOf(e.object);
    if (!grp) return;
    e.stopPropagation();
    const id = grp.name.replace("grp_", "");
    const next = activeHotspot === id ? null : id;
    setHotspot(next);
    if (next) track("hotspot_clicked", { id: next, via: "mesh" });
  };

  const showHotspots = currentState === "product" && !isMobile;

  return (
    <primitive object={scene} onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
      {showHotspots && machineData.hotspots.map((h, i) => {
        const anchor = scene.getObjectByName(h.anchorName);
        if (!anchor) return null;
        return (
          <Html key={h.id} position={anchor.getWorldPosition(new THREE.Vector3())}
                center distanceFactor={6} style={{ pointerEvents: "auto" }} zIndexRange={[20, 0]}>
            <button
              className={"hotspot hotspot-stagger" + (activeHotspot === h.id ? " hotspot-active" : "")}
              style={{ animationDelay: `${i * 90}ms` }}
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
