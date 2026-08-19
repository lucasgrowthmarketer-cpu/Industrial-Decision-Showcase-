"use client";
// Charge le Canvas apres detection des capacites (TDD sections 6 et 23).
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";

const Experience = dynamic(() => import("@/three/core/Experience"), { ssr: false });

function detectWebGL2(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!c.getContext("webgl2");
  } catch { return false; }
}

export function ExperienceLoader() {
  const [ready, setReady] = useState(false);
  const setDevice = useStore((s) => s.setDevice);
  const webglAvailable = useStore((s) => s.webglAvailable);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const webgl = detectWebGL2() && !reduced;
    setDevice({ webglAvailable: webgl, isMobile: window.matchMedia("(max-width: 768px)").matches });
    setReady(true);
  }, [setDevice]);

  if (!ready) return null;
  if (!webglAvailable) return null; // le contenu HTML Layer 0 reste la page
  return <Experience />;
}
