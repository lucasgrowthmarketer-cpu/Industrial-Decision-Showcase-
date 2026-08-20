"use client";
// Menu segmente uniforme type hyperliquid : une seule pilule de verre,
// l'indicateur actif glisse d'un item a l'autre (framer-motion layoutId).
import { motion } from "framer-motion";
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
        <button key={it.id}
          className={"nav-item" + (current === it.id ? " nav-item-active" : "")}
          onClick={() => setState(it.id)} aria-current={current === it.id}>
          {current === it.id ? (
            <motion.span layoutId="nav-pill" className="nav-pill"
              transition={{ type: "spring", stiffness: 420, damping: 36 }} />
          ) : null}
          <span className="nav-label">{it.label}</span>
        </button>
      ))}
    </nav>
  );
}
