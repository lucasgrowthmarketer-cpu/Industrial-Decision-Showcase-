"use client";
import { FeaturePanel, BigStat } from "./FeaturePanel";

export function DataPanel() {
  return (
    <FeaturePanel
      kicker="DATA EXPERIENCE"
      title="La donnée qui décide"
      items={[
        { id: "visibilite", title: "Visibilité", subtitle: "Authority Score, trafic organique",
          content: <BigStat value="12 → 34" label="Authority Score" note="8 400 visites organiques / mois · 612 mots-clés top 20" /> },
        { id: "opportunite", title: "Opportunité", subtitle: "Manque à gagner estimé",
          content: <BigStat value="2,5 M€" label="par an" note="Estimation basée sur la demande captée par vos concurrents" /> },
        { id: "croissance", title: "Croissance", subtitle: "Réservoirs identifiés",
          content: <BigStat value="82 %" label="score d'opportunité" note="5 réservoirs de croissance · 1,8 à 4,8 M€ / an" /> },
      ]}
      footer={<span className="demo-tag">Données de démonstration</span>}
    />
  );
}
