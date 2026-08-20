"use client";
// Monte le panneau correspondant a l'etat courant, apres la transition camera.
import { useStore } from "@/store/useStore";
import { DataPanel } from "./DataPanel";
import { WebsitePanel } from "./WebsitePanel";
import { AcquisitionPanel } from "./AcquisitionPanel";
import { FinalOverlay } from "./FinalOverlay";

export function PanelOverlay() {
  const currentState = useStore((s) => s.currentState);
  const isTransitioning = useStore((s) => s.isTransitioning);
  if (isTransitioning) return null;
  switch (currentState) {
    case "data": return <div className="panel-wrap"><DataPanel /></div>;
    case "website": return <div className="panel-wrap"><WebsitePanel /></div>;
    case "acquisition": return <div className="panel-wrap"><AcquisitionPanel /></div>;
    case "final": return <FinalOverlay />;
    default: return null;
  }
}
