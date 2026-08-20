"use client";
// Card de specs (TDD section 11) : panneau HTML fixe, JetBrains Mono,
// fermeture bouton / Escape / clic hors machine, navigation entre composants.
import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { track } from "@/lib/analytics";
import machineData from "@/config/machine.json";

export function HotspotCard() {
  const activeHotspot = useStore((s) => s.activeHotspot);
  const setHotspot = useStore((s) => s.setHotspot);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setHotspot(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setHotspot]);

  if (!activeHotspot) return null;
  const idx = machineData.hotspots.findIndex((h) => h.id === activeHotspot);
  const h = machineData.hotspots[idx];
  if (!h) return null;
  const go = (d: number) => {
    const n = machineData.hotspots[(idx + d + machineData.hotspots.length) % machineData.hotspots.length];
    setHotspot(n.id);
    track("hotspot_clicked", { id: n.id, via: "card_nav" });
  };

  return (
    <aside className="hotspot-card" role="dialog" aria-label={h.label}>
      <div className="hotspot-card-head">
        <span className="hotspot-card-label">{h.label}</span>
        <button className="hotspot-card-close" onClick={() => setHotspot(null)} aria-label="Fermer">×</button>
      </div>
      <dl className="hotspot-card-specs">
        {h.specs.map((s) => (
          <div key={s.key} className="spec-row">
            <dt>{s.key}</dt>
            <dd>{s.value}{"unit" in s && s.unit ? <span className="spec-unit"> {s.unit}</span> : null}</dd>
          </div>
        ))}
      </dl>
      <div className="hotspot-card-nav">
        <button onClick={() => go(-1)} aria-label="Composant precedent">←</button>
        <span>{idx + 1} / {machineData.hotspots.length}</span>
        <button onClick={() => go(1)} aria-label="Composant suivant">→</button>
      </div>
    </aside>
  );
}
