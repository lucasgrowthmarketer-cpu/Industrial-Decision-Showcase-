# Industrial Decision · Industrial Digital Experience

Showcase 3D et socle produit (Industrial Decision 3D Core). Reference : TDD v1.0.

## Demarrage
```
npm install
npm run model:validate   # verifie les conventions du GLB
npm run dev
```

## Structure
- `three/core/` : composants extractibles (CameraController, Machine, AnimationPlayer). Aucun contenu Industrial Decision en dur : tout vient de `config/`.
- `config/machine.json` : data model machine (TDD section 13). Remplacer la machine = nouveau GLB conforme + ce fichier.
- `config/camera-states.json` : etats camera declaratifs (TDD section 10).
- `scripts/validate-model.mjs` : validation des conventions du GLB, echec de build si violation.
- `scripts/optimize-model.mjs` : passe Draco (Codespace).

## Asset machine
`public/models/cnc_vmc.glb` : v3 optimisee (33 460 tris, 17 draw calls, quantization KHR, 771 Ko / 269 Ko gzip). Pivots d'animation : `grp_door` (slideOpen), `grp_spindle_rotor` et `grp_magazine_rotor` (rotation Z), `grp_table` (travel X). Offsets vue eclatee dans `userData.explodedOffset`.

## Gates
- Phase 0 : la machine s'affiche dans le Canvas deploye sur Railway.
- Phase 1 : 60 FPS desktop, 30+ FPS Android milieu de gamme reel.
