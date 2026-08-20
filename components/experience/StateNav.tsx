"use client";
// Dock flottant : NeonGlowButtons fournis par Industrial Decision, un par etat.
import { useStore, SceneState } from "@/store/useStore";
import { NeonGlowButton } from "@/components/ui/NeonGlowButton";

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
        <NeonGlowButton key={it.id} size="sm" label={it.label}
          active={current === it.id} onClick={() => setState(it.id)} />
      ))}
    </nav>
  );
}
