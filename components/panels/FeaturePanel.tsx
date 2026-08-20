"use client";
// FeaturePanel : pattern features-02 des references fournies (liste a gauche,
// apercu a droite, item actif en pilule douce). Verre depoli, zero bordure
// franche, transitions framer-motion. Un composant, trois panneaux.
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type FeatureItem = {
  id: string;
  title: string;
  subtitle: string;
  content: React.ReactNode;
};

export function FeaturePanel({
  kicker, title, items, footer,
}: {
  kicker: string;
  title: string;
  items: FeatureItem[];
  footer?: React.ReactNode;
}) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const active = items.find((i) => i.id === activeId) ?? items[0];

  return (
    <div className="fp glass">
      <div className="fp-head">
        <span className="fp-kicker">{kicker}</span>
        <h2 className="fp-title">{title}</h2>
      </div>
      <div className="fp-body">
        <div className="fp-list" role="tablist" aria-label={title}>
          {items.map((it) => (
            <button key={it.id} role="tab" aria-selected={it.id === active.id}
              className={"fp-item" + (it.id === active.id ? " fp-item-active" : "")}
              onClick={() => setActiveId(it.id)}>
              <span className="fp-item-title">{it.title}</span>
              <span className="fp-item-sub">{it.subtitle}</span>
            </button>
          ))}
        </div>
        <div className="fp-preview">
          <AnimatePresence mode="wait">
            <motion.div key={active.id}
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="fp-preview-inner">
              {active.content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {footer ? <div className="fp-footer">{footer}</div> : null}
    </div>
  );
}

// Apercu type "gros chiffre" (hierarchie typographique avant tout)
export function BigStat({ value, label, note }: { value: string; label: string; note?: string }) {
  return (
    <div className="bigstat">
      <div className="bigstat-value">{value}</div>
      <div className="bigstat-label">{label}</div>
      {note ? <div className="bigstat-note">{note}</div> : null}
    </div>
  );
}
