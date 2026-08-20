"use client";
// Sans WebGL2 ou avec prefers-reduced-motion : page complete stylisee
// + video de demonstration si presente (public/fallback/demo.mp4).
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { ContactForm } from "@/components/contact/ContactForm";

export function FallbackExperience({ onActivate3D }: { onActivate3D?: () => void }) {
  const [formOpen, setFormOpen] = useState(false);
  return (
    <div className="fallback">
      <div className="fallback-hero">
        <div className="fallback-logo"><Logo size={52} /></div>
        <h1>NOUS CONSTRUISONS DES SYSTÈMES DE DÉCISION.</h1>
        <p>
          Expériences digitales 3D, intelligence de marché et acquisition B2B
          pour PME et ETI industrielles.
        </p>
        <video className="fallback-video" controls playsInline preload="metadata"
               poster="/fallback/poster.jpg"
               onError={(e) => { (e.currentTarget as HTMLVideoElement).style.display = "none"; }}>
          <source src="/fallback/demo.mp4" type="video/mp4" />
        </video>
        <div className="fallback-actions">
          <button className="fallback-btn" onClick={() => setFormOpen(true)}>DEMANDER UNE DÉMO</button>
          {onActivate3D ? (
            <button className="fallback-btn fallback-btn-ghost" onClick={onActivate3D}>
              ACTIVER L'EXPÉRIENCE 3D
            </button>
          ) : null}
        </div>
      </div>
      {formOpen ? <ContactForm onClose={() => setFormOpen(false)} /> : null}
    </div>
  );
}
