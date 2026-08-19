"use client";
// Orchestration : detection capacites, masquage du contenu SEO des que
// l'experience 3D est retenue, loading, intro, overlay debug.
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { LoadingScreen } from "./LoadingScreen";
import { IntroSequence } from "./IntroSequence";
import { FpsOverlay } from "./FpsOverlay";

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
    // le contenu SEO reste dans le DOM (crawlers, lecteurs d'ecran) mais
    // n'est plus peint : c'etait le texte brut visible au chargement
    if (webgl) document.body.dataset.experience = "1";
    setReady(true);
  }, [setDevice]);

  if (!ready) return null;
  if (!webglAvailable) return null; // le contenu HTML Layer 0 reste la page
  return (
    <>
      <Experience />
      <LoadingScreen />
      <IntroSequence />
      <FpsOverlay />
    </>
  );
}
