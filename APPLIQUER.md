# Patch 4.1 · Anti-flash, nav segmentee, realisme (N8AO + clearcoat)

## Prerequis
```
cd /workspaces/Industrial-Decision-Showcase-
npm install @react-three/postprocessing postprocessing n8ao
```

## Application
```
unzip -o phase41-patch.zip
cat styles/nav-segmented.css >> styles/globals.css && rm styles/nav-segmented.css
npm run build
git add -A && git commit -m "4.1: pre-paint anti-flash, nav segmentee, N8AO + clearcoat" && git push
```

## Contenu
1. FLASH DU TEXTE : script inline dans <head>, execute avant le premier paint.
   Le contenu SEO n'apparait plus jamais brut, meme une frame.
2. NAV : menu segmente uniforme (une pilule de verre, indicateur actif qui
   glisse entre les items, spring framer-motion). Les NeonGlowButtons restent
   sur les controles machine et les CTA.
3. REALISME :
   - N8AO (occlusion ambiante ecran, desktop uniquement) : les jonctions,
     recoins et contacts s'assombrissent physiquement. Le plus gros gain.
   - Bloom subtil (seuil haut : seuls les reflets speculaires accrochent).
   - Aciers en MeshPhysicalMaterial + clearcoat 0.5 : vernis machine,
     double reflet caracteristique du metal peint industriel.
   - Typewriter du loading ralenti (62ms/caractere).

## Verification
1. Recharger en vidant le cache : plus aucun texte brut avant le loading.
2. Nav : la pilule glisse d'un onglet a l'autre.
3. PRODUIT desktop : recoins de la machine assombris (zone usinage, carrousel),
   reflets vernis sur broche et table.
4. ?debug=1 desktop : N8AO coute ~2-4ms/frame, verifier 60 FPS maintenu.
   Mobile inchange (pas de post-processing).

## Realisme, la suite honnete
Le prochain palier (micro-rayures, textures brossees) exige un depliage UV +
baking dans Blender sur votre machine. Script fourni sur demande si ce patch
ne suffit pas a votre oeil.
