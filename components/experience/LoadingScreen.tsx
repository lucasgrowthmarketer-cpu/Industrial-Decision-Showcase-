"use client";
// Loading screen premium (TDD section 24) : progression reelle via useProgress.
import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const { progress, active } = useProgress();
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!active && progress >= 100) {
      const t = setTimeout(() => setDone(true), 400);
      return () => clearTimeout(t);
    }
  }, [active, progress]);
  if (done) return null;
  const blocks = Math.round(progress / 5);
  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <div className="loading-brand">INDUSTRIAL DECISION</div>
      <div className="loading-label">INITIALIZING EXPERIENCE</div>
      <div className="loading-bar" aria-hidden="true">
        {"█".repeat(blocks)}{"░".repeat(20 - blocks)}
      </div>
      <div className="loading-pct">{Math.round(progress)}%</div>
    </div>
  );
}
