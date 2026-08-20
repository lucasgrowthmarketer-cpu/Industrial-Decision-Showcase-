"use client";
import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import { Typewriter } from "@/components/ui/Typewriter";
import { Logo } from "@/components/ui/Logo";

export function LoadingScreen() {
  const { progress, active } = useProgress();
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!active && progress >= 100) {
      const t = setTimeout(() => setDone(true), 500);
      return () => clearTimeout(t);
    }
  }, [active, progress]);
  if (done) return null;
  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <div className="loading-logo"><Logo size={44} /></div>
      <div className="loading-brand">INDUSTRIAL DECISION</div>
      <div className="loading-pct">{Math.round(progress)}<span className="loading-pct-unit">%</span></div>
      <div className="loading-line"><span style={{ width: `${progress}%` }} /></div>
      <div className="loading-type">
        <Typewriter
          texts={[
            "Initialisation de l'expérience",
            "Chargement de l'environnement industriel",
            "Préparation de la machine",
          ]}
          typeMs={42} holdMs={1100} deleteMs={20}
          color="#5a6b85" typedColor="#8a99b3" cursorColor="#207bff" />
      </div>
    </div>
  );
}
