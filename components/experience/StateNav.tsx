"use client";
// Navigation d'etats, labels francais.
import { useStore, SceneState } from "@/store/useStore";

const ITEMS: { id: SceneState; label: string }[] = [
  { id: "world", label: "ENSEMBLE" },
  { id: "product", label: "PRODUIT" },
  { id: "data", label: "DATA" },
  { id: "website", label: "SITE" },
  { id: "acquisition", label: "ACQUISITION" },
  { id: "final", label: "FINAL" },
];

export function StateNav() {
  const current = useStore((s) => s.currentState);
  const setState = useStore((s) => s.setState);
  return (
    <nav className="state-nav" aria-label="Sections">
      {ITEMS.map((it) => (
        <button key={it.id} onClick={() => setState(it.id)}
          className={current === it.id ? "active" : ""} aria-current={current === it.id}>
          {it.label}
        </button>
      ))}
    </nav>
  );
}
