"use client";
import { FeaturePanel } from "./FeaturePanel";

function Fiche({ nom, cat, spec, desc }: { nom: string; cat: string; spec: string; desc: string }) {
  return (
    <div className="fiche">
      <div className="fiche-cat">{cat}</div>
      <div className="fiche-nom">{nom}</div>
      <div className="fiche-spec">{spec}</div>
      <p className="fiche-desc">{desc}</p>
      <span className="fiche-cta">Fiche technique →</span>
    </div>
  );
}

export function WebsitePanel() {
  return (
    <FeaturePanel
      kicker="WEBSITE EXPERIENCE"
      title="Les produits complexes méritent mieux"
      items={[
        { id: "vmc", title: "ID-VMC 850", subtitle: "Fraisage · 3+2 axes",
          content: <Fiche nom="ID-VMC 850" cat="FRAISAGE" spec="Courses 850 x 520 x 540 mm"
            desc="Catalogue dynamique, fiche indexée, demande de devis en deux clics : chaque machine devient une porte d'entrée commerciale." /> },
        { id: "turn", title: "ID-TURN 42", subtitle: "Tournage · outils motorisés",
          content: <Fiche nom="ID-TURN 42" cat="TOURNAGE" spec="Ø 420 mm · 12 outils motorisés"
            desc="Le contenu technique structuré alimente le SEO et qualifie les demandes avant le premier appel." /> },
        { id: "grind", title: "ID-GRIND 60", subtitle: "Rectification · CN 3 axes",
          content: <Fiche nom="ID-GRIND 60" cat="RECTIFICATION" spec="Table 600 mm · CN 3 axes"
            desc="Brochures, applications, occasions : toute l'information au même endroit, sans friction." /> },
      ]}
      footer={<span className="demo-tag">Site de démonstration fictif · ID Machine Tools</span>}
    />
  );
}
