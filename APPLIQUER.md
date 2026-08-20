# Patch Phase 3 · Application

```
cd /workspaces/Industrial-Decision-Showcase-
unzip -o phase3-patch.zip
npm run build
```
Si vert :
```
git add -A && git commit -m "Phase 3: monde ID, panneaux Data/Site/Acquisition, finale, full FR" && git push
```

## Contenu
- Francisation complete : intro, nav, loading, controles, labels et specs machine.
- Sol fini (dalle + grille) et 3 cadres 3D de panneaux repositionnes hors de
  l'emprise machine (data a gauche, site a droite, acquisition a l'arriere).
- DataPanel : 6 indicateurs calques sur les audits Industrial Decision,
  mention Donnees de demonstration.
- WebsitePanel : mini-site fictif ID Machine Tools (catalogue, fiches, devis).
- AcquisitionPanel : funnel TRAFIC -> VENTES + leviers.
- Scene finale : NOUS NE CONSTRUISONS PAS DES SITES WEB. / NOUS CONSTRUISONS
  DES SYSTEMES DE DECISION. + CTA Demander une demo.
- Analytics : cta_clicked, intro_skipped branches.

## Verification
1. Enchainement complet intro -> ensemble -> produit -> data -> site ->
   acquisition -> final, au scroll et au menu.
2. Chaque panneau apparait apres la transition camera, cadre 3D visible derriere.
3. Tout est en francais, y compris les cards de specs.
4. CTA finale : mailto demarre, lien Industrial Decision s'ouvre.
5. ?debug=1 Android : pas de regression.
