"use client";
// Website Experience (TDD section 14) : mini-site fictif ID Machine Tools,
// architecture calquee sur les livrables reels (catalogue, fiche, devis).
const MACHINES = [
  { nom: "ID-VMC 850", cat: "Fraisage", spec: "Courses 850 x 520 x 540 mm" },
  { nom: "ID-TURN 42", cat: "Tournage", spec: "Ø 420 mm · 12 outils motorisés" },
  { nom: "ID-GRIND 60", cat: "Rectification", spec: "Table 600 mm · CN 3 axes" },
];

export function WebsitePanel() {
  return (
    <div className="panel-content">
      <div className="panel-kicker">WEBSITE EXPERIENCE</div>
      <h2 className="panel-title">Les produits complexes méritent mieux</h2>
      <div className="mini-site">
        <div className="mini-site-header">
          <span className="mini-site-logo">ID MACHINE TOOLS</span>
          <nav aria-hidden="true"><span>Gammes</span><span>Occasions</span><span>Services</span><span>Contact</span></nav>
        </div>
        <div className="mini-site-grid">
          {MACHINES.map((m) => (
            <div className="mini-card" key={m.nom}>
              <div className="mini-card-cat">{m.cat}</div>
              <div className="mini-card-name">{m.nom}</div>
              <div className="mini-card-spec">{m.spec}</div>
              <button className="mini-card-cta" tabIndex={-1}>Fiche technique</button>
            </div>
          ))}
        </div>
        <div className="mini-site-footer">Catalogue filtrable · Fiches techniques · Demande de devis · Brochures</div>
      </div>
      <p className="panel-caption">
        Site de démonstration fictif. La même mécanique : catalogue dynamique,
        contenu technique indexé, parcours de contact sans friction.
      </p>
    </div>
  );
}
