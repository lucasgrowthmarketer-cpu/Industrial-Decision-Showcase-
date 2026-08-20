"use client";
// Orchestration : detection, masquage SEO, loading, intro, controles machine,
// card hotspot, overlay debug, analytics d'etats.
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { LoadingScreen } from "./LoadingScreen";
import { IntroSequence } from "./IntroSequence";
import { FpsOverlay } from "./FpsOverlay";
import { HotspotCard } from "@/components/machine/HotspotCard";
import { MachineControls } from "@/components/machine/MachineControls";
import { track } from "@/lib/analytics";

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
    if (webgl) {
      document.body.dataset.experience = "1";
      track("experience_started");
    }
  }, [setDevice]);

  // analytics : entree dans chaque etat
  useEffect(() => {
    let prev = useStore.getState().currentState;
    const unsub = useStore.subscribe((s) => {
      if (s.currentState !== prev) {
        prev = s.currentState;
        track("state_entered", { state: s.currentState });
      }
    });
    setReady(true);
    return unsub;
  }, []);

  if (!ready) return null;
  if (!webglAvailable) return null; // le contenu HTML Layer 0 reste la page
  return (
    <>
      <Experience />
      <LoadingScreen />
      <IntroSequence />
      <HotspotCard />
      <MachineControls />
      <FpsOverlay />
    </>
  );
}
