# Patch Phase 2 · Application

```
cd /workspaces/Industrial-Decision-Showcase-
unzip -o phase2-patch.zip
npm run build
```

Si le build passe :
```
git add -A && git commit -m "Phase 2: hotspots complets, controles machine, typo de marque, analytics" && git push
```

## Verification (criteres du gate, PHASE2-REFERENCE.md section 4)
1. PRODUCT : cliquer les 5 hotspots, verifier focus camera + card + attenuation,
   fermeture par bouton, Escape, et clic dans le vide.
2. RUN CYCLE : cycle complet, retour idle propre.
3. EXPLODE / ASSEMBLE : reversible, hotspots actifs en vue eclatee.
4. Typo Manrope/Inter/JetBrains Mono partout.
5. ?debug=1 sur Android : pas de regression FPS.

## Analytics
Inactif tant que NEXT_PUBLIC_GA_ID n'est pas defini (variable Railway).
Aucun script charge sans lui.

## Fichiers du patch
lib/analytics.ts (nouveau) · components/machine/HotspotCard.tsx (nouveau) ·
components/machine/MachineControls.tsx (nouveau) · store/useStore.ts ·
three/core/Machine.tsx · three/core/CameraController.tsx ·
three/core/Experience.tsx · components/experience/ExperienceLoader.tsx ·
app/layout.tsx · styles/globals.css
