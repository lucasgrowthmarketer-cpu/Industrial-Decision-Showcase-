"use client";
// Scene finale (TDD section 17) : message + CTA.
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { track } from "@/lib/analytics";

export function FinalOverlay() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll(".final-seq");
    gsap.fromTo(els, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.9, ease: "power2.out", delay: 0.6 });
  }, []);
  return (
    <div className="final-overlay" ref={ref}>
      <div className="final-seq final-line">NOUS NE CONSTRUISONS PAS DES SITES WEB.</div>
      <div className="final-seq final-line final-strong">NOUS CONSTRUISONS DES SYSTÈMES DE DÉCISION.</div>
      <div className="final-seq final-cta-block">
        <div className="final-cta-title">CONSTRUISEZ LE VÔTRE</div>
        <div className="final-cta-actions">
          <a href="mailto:contact@industrialdecision.com?subject=Demande%20de%20d%C3%A9mo"
             className="btn-primary" onClick={() => track("cta_clicked", { location: "final_demo" })}>
            Demander une démo
          </a>
          <a href="https://www.industrialdecision.com" target="_blank" rel="noopener noreferrer"
             className="btn-ghost" onClick={() => track("cta_clicked", { location: "final_site" })}>
            Industrial Decision
          </a>
        </div>
      </div>
    </div>
  );
}
