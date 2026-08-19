// Server Component : contenu SEO Layer 0 (TDD sections 4 et 17).
// Le Canvas est une couche experientielle chargee par-dessus cote client.
import { ExperienceLoader } from "@/components/experience/ExperienceLoader";
import { StateNav } from "@/components/experience/StateNav";

export default function Home() {
  return (
    <main>
      <section className="seo-layer" aria-label="Industrial Decision">
        <h1>Industrial Decision</h1>
        <p>
          We don't build websites. We build decision systems. Agence digitale
          specialisee dans l'industrie : sites industriels nouvelle generation,
          experiences produit 3D, intelligence de marche et acquisition B2B pour
          fabricants de machines-outils, constructeurs et industriels.
        </p>
        <h2>Product Experience</h2>
        <p>Viewers 3D interactifs, showrooms industriels, configurateurs, digital twins.</p>
        <h2>Data Experience</h2>
        <p>Interfaces decisionnelles : marche, concurrence, scoring, opportunites.</p>
        <h2>Acquisition</h2>
        <p>De la visibilite a l'opportunite : SEO, contenu, site, CRM, ventes.</p>
        <h2>Contact</h2>
        <p><a href="mailto:contact@industrialdecision.com">contact@industrialdecision.com</a></p>
      </section>
      <ExperienceLoader />
      <StateNav />
    </main>
  );
}
