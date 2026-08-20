"use client";
// Acquisition Experience (TDD section 16) : de la visibilite a l'opportunite.
const STEPS = ["TRAFIC", "VISITEURS QUALIFIÉS", "LEADS", "OPPORTUNITÉS", "VENTES"];
const LEVIERS = ["SEO", "Contenu", "Site web", "CRM", "Commerce"];

export function AcquisitionPanel() {
  return (
    <div className="panel-content">
      <div className="panel-kicker">ACQUISITION</div>
      <h2 className="panel-title">De la visibilité à l'opportunité</h2>
      <div className="funnel">
        {STEPS.map((s, i) => (
          <div className="funnel-step" key={s} style={{ width: `${100 - i * 13}%` }}>
            {s}
          </div>
        ))}
      </div>
      <div className="leviers">
        {LEVIERS.map((l) => <span key={l} className="levier">{l}</span>)}
      </div>
      <p className="panel-caption">
        Le site n'est pas séparé du business : chaque levier alimente le suivant,
        chaque étape est mesurée.
      </p>
    </div>
  );
}
