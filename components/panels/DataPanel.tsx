"use client";
// Data Experience (TDD section 15) : indicateurs calques sur les livrables
// d'audit Industrial Decision. Donnees fictives, mention obligatoire.
const KPIS = [
  { label: "AUTHORITY SCORE", value: "12 → 34", note: "12 mois" },
  { label: "TRAFIC ORGANIQUE", value: "8 400", note: "visites / mois" },
  { label: "MOTS-CLÉS POSITIONNÉS", value: "612", note: "top 20 Google" },
  { label: "MANQUE À GAGNER", value: "2,5 M€", note: "par an, estimé" },
  { label: "RÉSERVOIRS DE CROISSANCE", value: "5", note: "1,8 à 4,8 M€ / an" },
  { label: "OPPORTUNITÉ", value: "82 %", note: "score marché" },
];

export function DataPanel() {
  return (
    <div className="panel-content">
      <div className="panel-kicker">DATA EXPERIENCE</div>
      <h2 className="panel-title">La donnée qui décide</h2>
      <div className="kpi-grid">
        {KPIS.map((k) => (
          <div className="kpi" key={k.label}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-note">{k.note}</div>
          </div>
        ))}
      </div>
      <p className="panel-caption">
        Marché, concurrence, scoring, opportunités : vos décisions industrielles
        appuyées sur des indicateurs mesurables.
      </p>
      <div className="panel-demo-tag">Données de démonstration</div>
    </div>
  );
}
