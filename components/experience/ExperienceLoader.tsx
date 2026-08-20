"use client";
// Orchestration Phase 4 : header logo, fallback stylise, reduced-motion en
// choix (propose, pas impose), chips mobiles.
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { LoadingScreen } from "./LoadingScreen";
import { IntroSequence } from "./IntroSequence";
import { FpsOverlay } from "./FpsOverlay";
import { FallbackExperience } from "./FallbackExperience";
import { HotspotCard } from "@/components/machine/HotspotCard";
import { HotspotChips } from "@/components/machine/HotspotChips";
import { MachineControls } from "@/components/machine/MachineControls";
import { PanelOverlay } from "@/components/panels/PanelOverlay";
import { Logo } from "@/components/ui/Logo";
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
  const [reduced, setReduced] = useState(false);
  const [force3D, setForce3D] = useState(false);
  const setDevice = useStore((s) => s.setDevice);
  const webglAvailable = useStore((s) => s.webglAvailable);

  useEffect(() => {
    const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const webgl = detectWebGL2();
    setReduced(r);
    setDevice({ webglAvailable: webgl, isMobile: window.matchMedia("(max-width: 768px)").matches });
    setReady(true);
  }, [setDevice]);

  const use3D = webglAvailable && (!reduced || force3D);

  useEffect(() => {
    if (!ready) return;
    if (use3D) {
      document.body.dataset.experience = "1";
      track("experience_started");
    } else {
      delete document.body.dataset.experience;
      track("fallback_served", { reason: !webglAvailable ? "webgl" : "reduced_motion" });
    }
  }, [ready, use3D, webglAvailable]);

  useEffect(() => {
    let prev = useStore.getState().currentState;
    const unsub = useStore.subscribe((s) => {
      if (s.currentState !== prev) {
        prev = s.currentState;
        track("state_entered", { state: s.currentState });
      }
    });
    return unsub;
  }, []);

  if (!ready) return null;
  if (!use3D) {
    return <FallbackExperience onActivate3D={webglAvailable ? () => setForce3D(true) : undefined} />;
  }
  return (
    <>
      <a className="brand" href="https://www.industrialdecision.com" target="_blank"
         rel="noopener noreferrer" aria-label="Industrial Decision">
        <Logo size={30} />
      </a>
      <Experience />
      <LoadingScreen />
      <IntroSequence />
      <HotspotCard />
      <HotspotChips />
      <MachineControls />
      <PanelOverlay />
      <FpsOverlay />
    </>
  );
}
