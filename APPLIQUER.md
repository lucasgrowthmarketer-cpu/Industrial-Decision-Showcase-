# Patch Phase 4 · Polish + formulaire de contact

## Prerequis
```
cd /workspaces/Industrial-Decision-Showcase-
npm install nodemailer
npm install -D @types/nodemailer
```

## Variables Railway a creer (service > Variables)
- SMTP_USER = lucas@industrialdecision.com
- SMTP_PASS = mot de passe d'application Google (16 caracteres)

IMPORTANT, lecon HealthUnion (erreur 535) : le mot de passe d'application doit
etre genere SUR le compte lucas@industrialdecision.com (myaccount.google.com >
Securite > Validation en deux etapes > Mots de passe des applications), pas sur
un autre compte, et lucas@ doit etre une vraie boite, pas un alias. Sans ces
variables, le formulaire repond une erreur propre et le reste du site vit.

## Application
```
unzip -o phase4-patch.zip
npm run build
git add -A && git commit -m "Phase 4: logo, formulaire SMTP, mobile chips, fallback, a11y, vitesses" && git push
```

## Contenu
- Logo ID : header (lien vers industrialdecision.com), loading, favicon
  (app/icon.svg, convention Next).
- Formulaire DEMANDER UNE DEMO : modal verre, honeypot, envoi via
  /api/contact (nodemailer, Gmail SMTP 465), reply-to = email du prospect.
- Mobile : hotspots en chips tactiles (44px) sous le Canvas, pastilles 3D
  desktop uniquement, DPR plafonne 1.5, shadow map 1024.
- Clic direct sur la machine : cliquer un composant = ouvrir son hotspot,
  avec hover emissif bleu desktop.
- Fallback stylise (logo + titre + video optionnelle + CTA) : servi sans
  WebGL2 ; avec prefers-reduced-motion, propose avec bouton ACTIVER LA 3D.
- Accessibilite : focus-visible partout, canvas aria-hidden, stagger
  d'apparition des hotspots.
- Vitesses : final 3.6s, acquisition 3.0s, cooldown scroll 1900ms, tout
  centralise dans config/experience.json et camera-states.json.

## Video fallback (votre partie, optionnelle mais recommandee)
Enregistrement d'ecran desktop de l'URL de prod, ~30s, parcours :
intro > ensemble (demi-orbite) > produit (1 hotspot + cycle) > data > final.
Exporter en mp4 H.264, deposer dans public/fallback/demo.mp4 (+ poster.jpg,
une capture). Sans fichier, le bloc video se masque tout seul.

## Verification
1. Logo en haut a gauche, favicon dans l'onglet.
2. FINAL > DEMANDER UNE DEMO > envoi reel : mail recu sur lucas@ avec
   reply-to du prospect. Sans variables SMTP : message d'erreur propre.
3. Mobile : chips sous le canvas en PRODUIT, tap = focus camera + card.
4. Desktop : survol machine = surbrillance bleue, clic = hotspot.
5. Systeme > reduire les animations : page fallback avec bouton ACTIVER LA 3D.
6. Tab au clavier : focus visibles partout.
