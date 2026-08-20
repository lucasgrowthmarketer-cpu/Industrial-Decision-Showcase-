"use client";
import { FeaturePanel, BigStat } from "./FeaturePanel";

export function AcquisitionPanel() {
  return (
    <FeaturePanel
      kicker="ACQUISITION"
      title="De la visibilité à l'opportunité"
      items={[
        { id: "trafic", title: "Trafic", subtitle: "SEO · contenu",
          content: <BigStat value="01" label="TRAFIC" note="Être trouvé par ceux qui cherchent déjà vos machines" /> },
        { id: "leads", title: "Leads", subtitle: "Site · formulaires",
          content: <BigStat value="02" label="VISITEURS → LEADS" note="Un site qui qualifie au lieu d'afficher" /> },
        { id: "ventes", title: "Ventes", subtitle: "CRM · commerce",
          content: <BigStat value="03" label="OPPORTUNITÉS → VENTES" note="Chaque étape mesurée, chaque levier relié au business" /> },
      ]}
      footer={<span className="demo-tag">SEO · Contenu · Site web · CRM · Commerce</span>}
    />
  );
}
