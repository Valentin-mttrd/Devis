# Devis — Studio VM

Outil de devis aux couleurs de Studio VM : un devis A4 avec les mentions légales obligatoires, rempli dans le navigateur et exporté en PDF.

- `public/index.html` — l’outil, autonome (polices et logo intégrés, fonctionne hors ligne).
- `public/exemple-devis-studio-vm.pdf` — un devis d’exemple.
- `netlify/edge-functions/auth.ts` — l’accès privé, par identifiant et mot de passe.

## Mise en ligne privée sur Netlify

1. Netlify → **Add new project** → **Import an existing project** → GitHub → `Valentin-mttrd/Devis`.
   Les réglages sont lus depuis `netlify.toml` : aucune commande de build, dossier publié `public`.
2. **Project configuration → Environment variables** :
   - `DEVIS_PASSWORD` : le mot de passe (obligatoire ; sans lui, le site reste fermé) ;
   - `DEVIS_USER` : l’identifiant (facultatif, `studio` par défaut).
3. **Deploys → Trigger deploy** pour appliquer les variables.

Le navigateur demande alors l’identifiant et le mot de passe à chaque nouvelle session. Le site n’est pas indexé par les moteurs de recherche.

## Utilisation

Remplissez le devis à gauche, l’aperçu se met à jour à droite. **Exporter en PDF** ouvre l’impression : choisissez « Enregistrer au format PDF » (Chrome ou Edge conseillés). **Enregistrer** garde un devis en `.json` pour le rouvrir plus tard. Les données restent dans votre navigateur.
