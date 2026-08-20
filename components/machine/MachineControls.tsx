"use client";
import { useRef } from "react";
import { useStore } from "@/store/useStore";
import { cycleDemo, explodedView } from "@/three/core/AnimationPlayer";
import { NeonGlowButton } from "@/components/ui/NeonGlowButton";
import { track } from "@/lib/analytics";

export function MachineControls() {
  const currentState = useStore((s) => s.currentState);
  const machineMode = useStore((s) => s.machineMode);
  const setMachineMode = useStore((s) => s.setMachineMode);
  const setState = useStore((s) => s.setState);
  const machineRoot = useStore((s) => s.machineRoot);
  const running = useRef<gsap.core.Timeline | null>(null);

  if (currentState !== "product") return null;

  const runCycle = () => {
    if (!machineRoot || machineMode !== "idle") return;
    setMachineMode("running");
    track("machine_animation_started", { id: "cycle_demo" });
    running.current = cycleDemo(machineRoot);
    running.current.eventCallback("onComplete", () => setMachineMode("idle"));
  };

  const toggleExplode = () => {
    if (!machineRoot || machineMode === "running") return;
    const on = machineMode !== "exploded";
    setMachineMode(on ? "exploded" : "idle");
    if (on) track("exploded_view_opened");
    explodedView(machineRoot, on);
  };

  return (
    <div className="machine-controls" role="toolbar" aria-label="Contrôles machine">
      <NeonGlowButton label={machineMode === "running" ? "CYCLE EN COURS..." : "LANCER LE CYCLE"}
        onClick={runCycle} disabled={machineMode !== "idle"} active={machineMode === "running"} />
      <NeonGlowButton label={machineMode === "exploded" ? "ASSEMBLER" : "VUE ÉCLATÉE"}
        onClick={toggleExplode} disabled={machineMode === "running"} active={machineMode === "exploded"} />
      <NeonGlowButton label="VUE D'ENSEMBLE" onClick={() => setState("world")} />
    </div>
  );
}
