# 🚀 Guide de Déploiement

## Options de Déploiement

### Option 1: Local (Pour Tester)

#### Méthode A: Double-clic
```
1. Naviguez vers le dossier du projet
2. Double-cliquez sur index.html
3. S'ouvre dans votre navigateur par défaut
```

⚠️ **Attention:** Cette méthode peut ne pas fonctionner à cause des modules ES6 qui nécessitent un serveur HTTP.

#### Méthode B: Serveur Local Python (Recommandé)
```bash
# Dans le dossier du projet
python -m http.server 8000

# Puis ouvrir dans le navigateur:
# http://localhost:8000
```

#### Méthode C: Serveur Local Node.js
```bash
# Installer http-server globalement (une fois)
npm install -g http-server

# Dans le dossier du projet
http-server -p 8000

# Ou sans installation:
npx http-server -p 8000
```

#### Méthode D: VS Code Live Server
```
1. Installer l'extension "Live Server" dans VS Code
2. Clic droit sur index.html
3. "Open with Live Server"
```

---

### Option 2: GitHub Pages (Gratuit, Simple)

#### Étapes:

1. **Créer un repo GitHub**
```bash
# Dans le dossier du projet
git init
git add .
git commit -m "Initial commit - ARK Calculator v2.0"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/ark-calculator.git
git push -u origin main
```

2. **Activer GitHub Pages**
- Aller sur https://github.com/VOTRE_USERNAME/ark-calculator
- Settings → Pages
- Source: "Deploy from a branch"
- Branch: `main` / `root`
- Save

3. **Accéder au site**
- URL: `https://VOTRE_USERNAME.github.io/ark-calculator/`
- Disponible en ~1 minute

✅ **Avantages:**
- Gratuit
- HTTPS automatique
- Simple à mettre à jour (git push)
- Domaine personnalisé possible

---

### Option 3: Netlify (Gratuit, Plus Puissant)

#### Méthode A: Drag & Drop

1. Aller sur [netlify.com](https://netlify.com)
2. Créer un compte (gratuit)
3. Cliquer sur "Add new site" → "Deploy manually"
4. Glisser-déposer le dossier du projet
5. Site déployé en quelques secondes!

#### Méthode B: GitHub Integration

1. Push votre code sur GitHub (voir Option 2, étape 1)
2. Sur Netlify: "Add new site" → "Import from Git"
3. Connecter GitHub
4. Sélectionner le repo
5. Build settings: (laisser vide, c'est du HTML statique)
6. Deploy!

✅ **Avantages:**
- Gratuit
- HTTPS automatique
- Déploiement continu (auto-deploy sur git push)
- Domaine personnalisé gratuit (.netlify.app)
- Prévisualisation des Pull Requests
- Analytics basiques

---

### Option 4: Vercel (Gratuit, Ultra-rapide)

```bash
# Installer Vercel CLI
npm install -g vercel

# Dans le dossier du projet
vercel

# Suivre les instructions
# Projet déployé en ~30 secondes!
```

OU via interface web:

1. Aller sur [vercel.com](https://vercel.com)
2. "Add New" → "Project"
3. Importer depuis GitHub
4. Deploy!

✅ **Avantages:**
- Gratuit
- Extrêmement rapide (CDN global)
- HTTPS automatique
- Déploiement continu
- Domaine personnalisé gratuit (.vercel.app)
- Analytics avancés (payant)

---

### Option 5: Hébergement Classique (cPanel, FTP)

1. **Préparer les fichiers**
```bash
# Créer une archive si nécessaire
zip -r ark-calculator.zip . -x "*.git*" -x "README.md" -x "CHANGEMENTS.md"
```

2. **Upload via FTP**
- Utiliser FileZilla, WinSCP, ou interface cPanel
- Upload tous les fichiers vers `public_html` ou `www`
- Préserver la structure de dossiers

3. **Vérifier**
- Accéder à `http://votre-domaine.com/`
- Vérifier que tout fonctionne

---

## Configuration Selon l'Hébergement

### Structure de Fichiers Requise

```
/
├── index.html          ← OBLIGATOIRE
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── calculator.js
│   ├── ui.js
│   ├── config.js
│   └── database.js
└── icons-20260117T210540Z-001/
    └── icons/
        └── *.png
```

### Permissions Requises

```bash
# Linux/Unix seulement
chmod 755 index.html
chmod 755 css/ js/ icons-20260117T210540Z-001/
chmod 644 css/* js/* icons-20260117T210540Z-001/icons/*
```

### Headers HTTP Recommandés

Si vous avez accès à la config serveur (`.htaccess` pour Apache):

```apache
# .htaccess
<IfModule mod_mime.c>
  AddType application/javascript js
  AddType text/css css
</IfModule>

# Cache pour les assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>
```

---

## Problèmes Courants & Solutions

### Problème 1: Modules ES6 ne chargent pas

**Symptôme:**
```
Access to script at 'file:///C:/path/to/js/app.js' from origin 'null'
has been blocked by CORS policy
```

**Cause:** Les modules ES6 nécessitent un serveur HTTP

**Solution:** Utiliser un serveur local (Python, Node, VS Code Live Server)

---

### Problème 2: Icônes ne s'affichent pas

**Symptôme:** Carrés vides à la place des icônes

**Cause 1:** Chemin incorrect

**Solution:**
```javascript
// Vérifier dans config.js
export const ICONS_PATH = "icons-20260117T210540Z-001/icons/";
// OU ajuster selon votre structure
```

**Cause 2:** Permissions incorrectes (Linux/Unix)

**Solution:**
```bash
chmod -R 755 icons-20260117T210540Z-001/
```

---

### Problème 3: CSS ne s'applique pas

**Symptôme:** Page sans styles, texte brut

**Solution:**
```html
<!-- Vérifier dans index.html -->
<link rel="stylesheet" href="css/styles.css">

<!-- PAS de '/' au début -->
<!-- INCORRECT: href="/css/styles.css" -->
```

---

### Problème 4: localStorage ne fonctionne pas

**Cause:** Certains navigateurs bloquent localStorage en `file://`

**Solution:** Utiliser un serveur HTTP (même en local)

---

### Problème 5: Bannière ne s'affiche pas

**Cause:** Image hébergée sur imgur

**Solution A (Rapide):** Laisser tel quel (nécessite internet)

**Solution B (Recommandé):**
1. Télécharger l'image depuis `https://i.imgur.com/nC9hSdv.png`
2. Sauvegarder dans `images/banner.png`
3. Modifier `index.html`:
```html
<img src="images/banner.png" alt="Bannière ARK: Primal Descended">
```

---

## Checklist Pré-Déploiement

- [ ] Tester localement avec un serveur HTTP
- [ ] Vérifier que toutes les icônes s'affichent
- [ ] Tester sur mobile (responsive)
- [ ] Tester les fonctionnalités:
  - [ ] Compteurs +/-
  - [ ] Inputs directs
  - [ ] Reset
  - [ ] Export/Import
  - [ ] Copie résultats
  - [ ] Changement de thème
  - [ ] Sauvegarde auto (localStorage)
- [ ] Tester sur plusieurs navigateurs:
  - [ ] Chrome/Edge
  - [ ] Firefox
  - [ ] Safari (si Mac)
- [ ] Vérifier la console pour erreurs JavaScript
- [ ] Vérifier Network tab pour erreurs 404

---

## Post-Déploiement

### 1. Vérification

```bash
# Tester que le site est accessible
curl -I https://votre-site.com/

# Devrait retourner:
# HTTP/2 200
```

### 2. Performance

Utiliser [PageSpeed Insights](https://pagespeed.web.dev/):
```
https://pagespeed.web.dev/analysis?url=https://votre-site.com/
```

**Score attendu:**
- Performance: 90-100
- Accessibility: 95-100
- Best Practices: 90-100
- SEO: 80-100

### 3. Partage

URL à partager:
```
https://votre-site.com/
```

Ou créer un QR code pour mobile:
```
https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://votre-site.com/
```

---

## Mise à Jour

### GitHub Pages / Netlify / Vercel (avec Git)

```bash
# Faire vos modifications
git add .
git commit -m "Mise à jour: description des changements"
git push

# Déploiement automatique en 1-2 minutes
```

### FTP / cPanel

1. Modifier les fichiers localement
2. Tester localement
3. Upload les fichiers modifiés via FTP
4. Vider le cache du navigateur pour voir les changements

---

## Monitoring (Optionnel)

### Google Analytics

1. Créer un compte GA
2. Ajouter avant `</head>` dans index.html:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Uptime Monitoring

Services gratuits:
- [UptimeRobot](https://uptimerobot.com/) - 50 monitors gratuits
- [Pingdom](https://www.pingdom.com/) - 1 site gratuit
- [StatusCake](https://www.statuscake.com/) - Monitoring basique gratuit

---

## Domaine Personnalisé (Optionnel)

### 1. Acheter un Domaine

Registrars recommandés:
- [Namecheap](https://www.namecheap.com/)
- [Google Domains](https://domains.google/)
- [Cloudflare](https://www.cloudflare.com/products/registrar/)

Prix typique: ~10-15€/an pour .com

### 2. Configurer DNS

#### Pour GitHub Pages:
```
Type: A
Name: @
Value: 185.199.108.153

Type: CNAME
Name: www
Value: VOTRE_USERNAME.github.io
```

#### Pour Netlify/Vercel:
Suivre les instructions dans le dashboard (chaque plateforme a son assistant)

### 3. Activer HTTPS

GitHub Pages / Netlify / Vercel:
- HTTPS automatique avec Let's Encrypt
- Activé par défaut

---

## Support & Maintenance

### Logs

Si problèmes:

1. **Console navigateur** (F12)
   - Voir erreurs JavaScript
   - Vérifier requêtes réseau

2. **Server logs** (si accès)
   - Erreurs 404
   - Erreurs de permissions

### Backup

```bash
# Faire un backup régulier
git add .
git commit -m "Backup $(date +%Y-%m-%d)"
git push
```

Ou:
```bash
# Archive ZIP avec date
zip -r ark-calculator-backup-$(date +%Y-%m-%d).zip . -x "*.git*"
```

---

## Résumé des Commandes

### Déploiement Rapide (Netlify)
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Déploiement Rapide (Vercel)
```bash
npm install -g vercel
vercel --prod
```

### Déploiement Rapide (GitHub Pages)
```bash
git init
git add .
git commit -m "Deploy ARK Calculator"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
# Puis activer Pages dans Settings
```

---

**Bon déploiement! 🚀**

Pour toute question, consulter la documentation des plateformes ou ouvrir une issue GitHub.
