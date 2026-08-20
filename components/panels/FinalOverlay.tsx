"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { NeonGlowButton } from "@/components/ui/NeonGlowButton";
import { ContactForm } from "@/components/contact/ContactForm";
import { track } from "@/lib/analytics";

export function FinalOverlay() {
  const ref = useRef<HTMLDivElement>(null);
  const [formOpen, setFormOpen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll(".final-seq");
    gsap.fromTo(els, { opacity: 0, y: 16, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.0, stagger: 0.9, ease: "power2.out", delay: 0.6 });
  }, []);
  return (
    <>
      <div className="final-overlay" ref={ref}>
        <div className="final-seq final-line">NOUS NE CONSTRUISONS PAS DES SITES WEB.</div>
        <div className="final-seq final-line final-strong">NOUS CONSTRUISONS DES SYSTÈMES DE DÉCISION.</div>
        <div className="final-seq final-cta-block">
          <div className="final-cta-title">CONSTRUISEZ LE VÔTRE</div>
          <div className="final-cta-actions">
            <NeonGlowButton size="lg" label="DEMANDER UNE DÉMO"
              onClick={() => { setFormOpen(true); track("cta_clicked", { location: "final_demo" }); }} />
            <NeonGlowButton size="lg" label="INDUSTRIAL DECISION" glowColor="#3a4a6a"
              href="https://www.industrialdecision.com" newTab
              onClick={() => track("cta_clicked", { location: "final_site" })} />
          </div>
        </div>
      </div>
      {formOpen ? <ContactForm onClose={() => setFormOpen(false)} /> : null}
    </>
  );
}
