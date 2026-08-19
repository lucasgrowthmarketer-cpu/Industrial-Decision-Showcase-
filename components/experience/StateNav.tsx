"use client";
// Navigation d'etats provisoire Phase 0/1 : les 3 entrees (menu ici, scroll et
// boutons contextuels ensuite) pilotent la meme machine a etats.
import { useStore, SceneState } from "@/store/useStore";

const ORDER: SceneState[] = ["world", "product", "data", "website", "acquisition", "final"];

export function StateNav() {
  const current = useStore((s) => s.currentState);
  const setState = useStore((s) => s.setState);
  return (
    <nav className="state-nav" aria-label="Sections">
      {ORDER.map((s) => (
        <button key={s} onClick={() => setState(s)}
          className={current === s ? "active" : ""} aria-current={current === s}>
          {s.toUpperCase()}
        </button>
      ))}
    </nav>
  );
}
