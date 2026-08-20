"use client";
// Mobile : les hotspots deviennent des chips HTML (cibles tactiles fiables,
// TDD section 22), le tap declenche le meme focus camera que les pastilles 3D.
import { useStore } from "@/store/useStore";
import { track } from "@/lib/analytics";
import machineData from "@/config/machine.json";

export function HotspotChips() {
  const currentState = useStore((s) => s.currentState);
  const isMobile = useStore((s) => s.isMobile);
  const activeHotspot = useStore((s) => s.activeHotspot);
  const setHotspot = useStore((s) => s.setHotspot);
  if (!isMobile || currentState !== "product") return null;
  return (
    <div className="hotspot-chips" role="tablist" aria-label="Composants">
      {machineData.hotspots.map((h) => (
        <button key={h.id} role="tab" aria-selected={activeHotspot === h.id}
          className={"chip" + (activeHotspot === h.id ? " chip-active" : "")}
          onClick={() => {
            const next = activeHotspot === h.id ? null : h.id;
            setHotspot(next);
            if (next) track("hotspot_clicked", { id: next, via: "chip" });
          }}>
          {h.label}
        </button>
      ))}
    </div>
  );
}
