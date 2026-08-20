# Patch Phase 3.5 · Direction artistique
## Verre depoli, features-02, NeonGlow, Typewriter

## Prerequis : framer-motion (requis par NeonGlowButton et Typewriter)
```
cd /workspaces/Industrial-Decision-Showcase-
npm install framer-motion
```

## Application
```
unzip -o phase35-patch.zip
npm run build
```
Si vert :
```
git add -A && git commit -m "Phase 3.5: DA verre, features-02, NeonGlow nav/controles, Typewriter" && git push
```

## Ce qui change
- PLAQUES 3D SUPPRIMEES → halos de lumiere au sol par station (StationHalos).
- Panneaux Data / Site / Acquisition refondus sur le pattern features-02 des
  references fournies : liste a gauche, apercu a droite, verre depoli sans
  bordure, gros chiffres, transitions spring + blur.
- Navigation → dock pilule flottant en NeonGlowButtons (presets #001FFF fournis).
- Controles machine → NeonGlowButtons (LANCER LE CYCLE, VUE ECLATEE, etc.).
- Loading → pourcentage geant Manrope 200 + ligne fine + Typewriter Originkit.
- CTA finale → NeonGlowButtons lg.
- Design system unifie : .glass, radius 26, plus aucune boite a bordure 1px.

## Reglages rapides
- Couleur du glow : prop glowColor (defaut #001FFF, vos presets).
- Intensite du verre : --glass-bg et blur(26px) dans globals.css.
- Halos : rayon/opacite dans three/showcase/StationHalos.tsx.

## Verification
1. Nav dock : glow au survol et sur l'etat actif, rotation des anneaux.
2. Loading : typewriter qui tape/efface, pourcentage qui monte.
3. DATA / SITE / ACQUISITION : liste-apercu, clic sur chaque item, aucune
   bordure dure nulle part.
4. PRODUIT : boutons neon, disabled attenue pendant le cycle.
5. Les 3 halos bleus au sol aux emplacements des stations.
6. ?debug=1 Android : le blur du verre est le point a surveiller en FPS.
