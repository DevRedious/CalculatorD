# 🐉 Rilindra - Calculateur ARK: Primal Descended

Calculateur de ressources élégant pour ARK: Primal Descended avec design moderne et effet glassmorphism.

![Version](https://img.shields.io/badge/version-2.0-red)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Caractéristiques

- 🎨 **Design moderne** - Interface style cartes avec glassmorphism
- 🐉 **Fond Rilindra** - Dragon animé en arrière-plan avec blur
- 🌓 **Toggle Dark/Light** - Changement de thème fluide
- 💾 **Sauvegarde auto** - localStorage pour conserver vos sélections
- 📱 **Responsive** - S'adapte à tous les écrans
- ⚡ **Performance** - Architecture modulaire ES6
- ♿ **Accessible** - Navigation clavier, ARIA labels

## 🚀 Démarrage rapide

### Option 1: Serveur local Python
```bash
cd Calculator_descended
python -m http.server 8000
```
Ouvrir: http://localhost:8000

### Option 2: Live Server (VS Code)
1. Installer l'extension "Live Server"
2. Clic droit sur `index.html` → "Open with Live Server"

## 📁 Structure du projet

```
Calculator_descended/
├── index.html                 # Page principale
├── css/
│   └── styles.css            # Styles consolidés
├── js/
│   ├── app.js               # Point d'entrée + ThemeManager
│   ├── calculator.js        # Logique métier
│   ├── config.js            # Configuration
│   ├── database.js          # Base de données des tiers
│   └── ui.js                # Gestion interface
├── images/
│   ├── favicon.png          # Logo Rilindra
│   └── banner.png           # Bannière dragon
├── icons-20260117.../       # Icônes des tiers
└── docs/                    # Documentation complète
```

## 🎯 Fonctionnalités

### Calculateur
- Sélection par cartes interactives
- 18 tiers disponibles (T4-T8, Celestial, Abyssal, etc.)
- Calcul automatique des ressources
- Affichage des résultats en temps réel
- Compteur +/- avec validation

### Interface
- Header fixe avec navigation
- Grille responsive de cartes
- Effet hover avec élévation
- Barre rouge animée au survol
- Badge catégorie par tier

### Thème
- Toggle minimaliste sans icônes
- Animation cubic-bezier fluide
- Persistance localStorage
- Variables CSS pour cohérence

## 🛠️ Technologies

- **HTML5** - Structure sémantique
- **CSS3** - Glassmorphism, animations, grid
- **JavaScript ES6** - Modules, classes, async/await
- **Vanilla JS** - Aucune dépendance externe

## 📚 Documentation

Consultez le dossier `docs/` pour:
- **DEMARRAGE_RAPIDE.md** - Guide de démarrage
- **CHANGEMENTS.md** - Liste des modifications
- **DEPLOIEMENT.md** - Guide de déploiement
- **TOGGLE_MINIMALISTE.md** - Documentation du toggle
- **TEST_TOGGLE.html** - Page de test du toggle
- **verify.html** - Vérification du calculateur

## 🎨 Personnalisation

### Changer les couleurs
```css
/* css/styles.css */
:root[data-theme="dark"] {
  --accent-primary: #c00;    /* Rouge → Votre couleur */
  --bg-primary: #000;        /* Noir → Votre couleur */
}
```

### Ajouter un tier
```javascript
// js/config.js
export const TIERS = [
  'T4_Abyssal',
  'VOTRE_NOUVEAU_TIER',  // Ajouter ici
  // ...
];
```

### Modifier le fond
Remplacer `images/banner.png` par votre image (format recommandé: 1920x1080px)

## 🐛 Bugs résolus

- ✅ Fuite mémoire (event listeners dupliqués)
- ✅ ICONS_PATH incorrect
- ✅ Validation des inputs
- ✅ Performance DOM optimisée

## 📈 Performance

- **Code réduit** de ~60% vs version précédente
- **Aucune dépendance** externe
- **Lazy loading** des images
- **Debouncing** des inputs
- **Event delegation** pour efficacité

## 🙏 Crédits

- **Toggle design** - JkHuger (Uiverse.io)
- **Branding** - Rilindra
- **ARK** - Studio Wildcard

## 📄 Licence

MIT License - Libre d'utilisation et modification

## 🤝 Contribution

Les contributions sont bienvenues! Pour proposer des améliorations:
1. Fork le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit (`git commit -m 'Ajout amélioration'`)
4. Push (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

---

**Fait avec ❤️ pour la communauté ARK**

🐉 **Rilindra** - Le dragon des flammes
