"use client";
// Formulaire de demo : verre, honeypot, etats envoi/succes/erreur.
import { useState } from "react";
import { NeonGlowButton } from "@/components/ui/NeonGlowButton";
import { track } from "@/lib/analytics";

export function ContactForm({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      track("contact_submitted");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="contact-modal" role="dialog" aria-modal="true" aria-label="Demander une démo">
      <div className="contact-box glass">
        <button className="contact-close" onClick={onClose} aria-label="Fermer">×</button>
        {status === "sent" ? (
          <div className="contact-sent">
            <div className="contact-sent-title">Message envoyé</div>
            <p>Nous revenons vers vous sous 24 h ouvrées.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="contact-form">
            <div className="contact-kicker">DEMANDER UNE DÉMO</div>
            <label>Nom<input name="nom" required autoComplete="name" /></label>
            <label>Société<input name="societe" autoComplete="organization" /></label>
            <label>Email<input name="email" type="email" required autoComplete="email" /></label>
            <label>Votre projet<textarea name="message" rows={4} required /></label>
            <input name="site" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
            {status === "error" ? <div className="contact-error">L'envoi a échoué. Réessayez ou écrivez à contact@industrialdecision.com</div> : null}
            <div className="contact-actions">
              <NeonGlowButton size="md" label={status === "sending" ? "ENVOI..." : "ENVOYER"} disabled={status === "sending"} />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
