"use client";
// ProductViewer : hotspots 3D desktop uniquement (chips HTML sur mobile),
// hover emissif leger sur les groupes, attenuation au focus.
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

function findGroupName(o: THREE.Object3D | null): string | null {
  while (o) {
    if (o.name.startsWith("grp_")) return o.name;
    o = o.parent;
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
  const hoverGroup = useRef<string | null>(null);

  useMemo(() => {
    // clone par mesh (attenuation par groupe) + montee en gamme des aciers :
    // MeshPhysicalMaterial avec clearcoat leger = reflets de vernis machine
    const upgrade = (mat: THREE.Material): THREE.Material => {
      const cloned = mat.clone();
      if (cloned.name.startsWith("mat_steel")) {
        const phys = new THREE.MeshPhysicalMaterial();
        THREE.MeshStandardMaterial.prototype.copy.call(phys, cloned as THREE.MeshStandardMaterial);
        phys.clearcoat = 0.5;
        phys.clearcoatRoughness = 0.25;
        return phys;
      }
      if (cloned.name === "mat_frame") {
        const phys = new THREE.MeshPhysicalMaterial();
        THREE.MeshStandardMaterial.prototype.copy.call(phys, cloned as THREE.MeshStandardMaterial);
        phys.clearcoat = 0.18;
        phys.clearcoatRoughness = 0.5;
        return phys;
      }
      return cloned;
    };
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && !m.userData.__cloned) {
        m.material = Array.isArray(m.material)
          ? m.material.map(upgrade)
          : upgrade(m.material as THREE.Material);
        m.userData.__cloned = true;
      }
    });
    return null;
  }, [scene]);
  useEffect(() => {
    setMachineRoot(scene);
    return () => setMachineRoot(null);
  }, [scene, setMachineRoot]);

  // attenuation au focus hotspot
  useEffect(() => {
    const focusGroup = activeHotspot ? GROUP_OF[activeHotspot] : null;
    const apply = (grpName: string, dim: boolean) => {
      const grp = scene.getObjectByName(grpName);
      grp?.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh) return;
        const mats = Array.isArray(m.material) ? m.material : [m.material];
        mats.forEach((mat) => {
          mat.transparent = true;
          gsap.to(mat, { opacity: dim ? 0.22 : 1, duration: 0.5, ease: "power2.out" });
        });
      });
    };
    machineData.hotspots.forEach((h) => apply(GROUP_OF[h.id], focusGroup !== null && GROUP_OF[h.id] !== focusGroup));
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

  // hover emissif (desktop, etat product, hors focus)
  const setEmissive = (grpName: string | null, on: boolean) => {
    if (!grpName) return;
    const grp = scene.getObjectByName(grpName);
    grp?.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const mats = (Array.isArray(m.material) ? m.material : [m.material]) as THREE.MeshStandardMaterial[];
      mats.forEach((mat) => {
        if (!mat.emissive) return;
        gsap.to(mat, { emissiveIntensity: on ? 0.35 : 0, duration: 0.3 });
        mat.emissive.set("#207bff");
      });
    });
  };

  const showHotspots3D = currentState === "product" && !isMobile;
  const hoverEnabled = currentState === "product" && !isMobile && !activeHotspot;

  return (
    <primitive object={scene}
      onPointerOver={(e: { object: THREE.Object3D; stopPropagation: () => void }) => {
        if (!hoverEnabled) return;
        e.stopPropagation();
        const g = findGroupName(e.object);
        if (g === hoverGroup.current) return;
        setEmissive(hoverGroup.current, false);
        hoverGroup.current = g;
        setEmissive(g, true);
        document.body.style.cursor = g && g !== "grp_body" ? "pointer" : "default";
      }}
      onPointerOut={() => {
        setEmissive(hoverGroup.current, false);
        hoverGroup.current = null;
        document.body.style.cursor = "default";
      }}
      onClick={(e: { object: THREE.Object3D; stopPropagation: () => void }) => {
        if (!hoverEnabled) return;
        e.stopPropagation();
        const g = findGroupName(e.object);
        const h = machineData.hotspots.find((x) => GROUP_OF[x.id] === g);
        if (h) { setHotspot(h.id); track("hotspot_clicked", { id: h.id, via: "mesh" }); }
      }}>
      {showHotspots3D && machineData.hotspots.map((h, i) => {
        const anchor = scene.getObjectByName(h.anchorName);
        if (!anchor) return null;
        return (
          <Html key={h.id} position={anchor.getWorldPosition(new THREE.Vector3())}
                center distanceFactor={6} style={{ pointerEvents: "auto" }} zIndexRange={[20, 0]}>
            <button
              className={"hotspot hotspot-appear" + (activeHotspot === h.id ? " hotspot-active" : "")}
              style={{ animationDelay: `${i * 90}ms` }}
              onClick={(ev) => {
                ev.stopPropagation();
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
