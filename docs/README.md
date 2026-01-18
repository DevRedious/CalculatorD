# ARK: Primal Descended - Calculateur de Ressources

Calculateur web pour déterminer les ressources nécessaires pour chaque tier dans ARK: Primal Descended.

## 🚀 Nouveautés v2.0

### Corrections Critiques
- ✅ **Fuite mémoire corrigée** - Les event listeners ne sont plus dupliqués à chaque calcul
- ✅ **Inputs standards** - Remplacement de `contenteditable` par `<input type="number">` pour une meilleure UX
- ✅ **CSS consolidé** - Élimination de la duplication entre styles inline et fichier CSS externe
- ✅ **Base de données améliorée** - Capitalisation corrigée et structure optimisée

### Nouvelles Fonctionnalités
- 💾 **Sauvegarde automatique** - Vos sélections sont sauvegardées dans le navigateur
- 📤 **Export/Import** - Sauvegardez et partagez vos configurations en JSON
- 📋 **Copie des résultats** - Copiez rapidement les résultats dans le presse-papier
- 🌓 **Mode sombre/clair** - Bouton pour basculer entre les thèmes
- ⌨️ **Raccourcis clavier** - Navigation et actions rapides au clavier
- ♿ **Accessibilité** - ARIA labels, navigation clavier, sémantique HTML

### Améliorations Techniques
- 📦 **Architecture modulaire** - Code organisé en modules ES6
- 🎯 **Séparation des responsabilités** - Calculator (logique), UI (interface), Database (données)
- ⚡ **Performance optimisée** - Debouncing, délégation d'événements, gestion efficace du DOM
- 📱 **Responsive amélioré** - Breakpoints optimisés pour mobile, tablette et desktop
- 🎨 **Variables CSS** - Thème facilement personnalisable avec variables CSS

## 📁 Structure du Projet

```
Calculator_descended/
├── index.html                     # Page principale
├── css/
│   └── styles.css                # Styles consolidés
├── js/
│   ├── app.js                    # Point d'entrée de l'application
│   ├── calculator.js             # Logique métier (calculs, état)
│   ├── ui.js                     # Gestion de l'interface utilisateur
│   ├── config.js                 # Configuration (tiers, settings)
│   └── database.js               # Base de données des items
└── icons-20260117T210540Z-001/   # Icônes des tiers et items
    └── icons/
```

## 🎮 Utilisation

### Ouverture Locale
1. Ouvrez `index.html` dans un navigateur moderne
2. Sélectionnez les quantités de tiers désirées
3. Les résultats s'affichent automatiquement

### Hébergement Web
Déployez simplement les fichiers sur n'importe quel serveur web statique :
- GitHub Pages
- Netlify
- Vercel
- Ou tout autre hébergement statique

## ⌨️ Raccourcis Clavier

- `Ctrl/Cmd + E` - Exporter la configuration
- `Ctrl/Cmd + I` - Importer une configuration
- `Ctrl/Cmd + Shift + C` - Copier les résultats
- `Ctrl/Cmd + R` - Réinitialiser (avec confirmation)
- `Enter` - Valider un input numérique
- `Tab` - Navigation entre les compteurs

## 🎨 Personnalisation du Thème

Les couleurs sont définies dans `css/styles.css` via des variables CSS :

```css
:root[data-theme="dark"] {
  --bg-primary: #000;
  --accent-primary: #c00;
  /* ... autres variables ... */
}
```

Modifiez ces valeurs pour personnaliser l'apparence.

## 🔧 Développement

### Structure des Modules

#### `calculator.js` - Logique Métier
- Gestion de l'état des sélections
- Calculs des ressources nécessaires
- Export/Import de configurations
- Sauvegarde localStorage
- Historique des calculs

#### `ui.js` - Interface Utilisateur
- Génération dynamique du DOM
- Gestion des événements (délégation)
- Mise à jour des résultats
- Notifications toast
- Copie dans le presse-papier

#### `database.js` - Données
- Définition de tous les items et leurs coûts
- Fonctions de validation
- Helpers pour accéder aux données

#### `config.js` - Configuration
- Liste des tiers
- Mapping des colonnes
- Paramètres de l'application
- Constantes

#### `app.js` - Point d'Entrée
- Initialisation de l'application
- ThemeManager (gestion du thème)
- FeatureManager (fonctionnalités avancées)
- Raccourcis clavier

### Debugging

En mode développement (localhost), l'objet `arkApp` est exposé dans `window` :

```javascript
// Console du navigateur
arkApp.calculator.getTier('T4_Abyssal')
arkApp.calculator.export()
arkApp.ui.showToast('Test message')
```

## 📊 Base de Données

La base de données contient 40+ items avec leurs coûts pour 18 tiers différents :

### Tiers Disponibles
- **T4**: Abyssal, Celestial
- **T5**: Nidhogg, Chaos, Order
- **T6**: Normal, Giga
- **T7**: DodoBleu, DodoRouge, WReaper, WGiga
- **T8**: Ascension, Descension
- **T9**: 1Seal, 2Seal, 3Seal, 4Seal, Cube

### Types d'Items
- Artefacts
- Clés (Keys)
- Âmes (Souls)
- Essences
- Trophées
- Fragments
- Ressources diverses

## ♿ Accessibilité

Le calculateur respecte les standards d'accessibilité :
- Navigation complète au clavier
- Labels ARIA pour les lecteurs d'écran
- HTML sémantique (fieldset, legend, section)
- Contraste de couleurs suffisant
- Focus visible sur les éléments interactifs
- Messages de statut (aria-live)

## 🐛 Bugs Corrigés

### v2.0
1. **Fuite mémoire critique** - Les event listeners étaient ajoutés à chaque `updateResults()`, causant une multiplication des listeners et une consommation croissante de mémoire
2. **Inputs non standards** - `contenteditable` remplacé par `<input type="number">` pour une meilleure validation et UX
3. **Duplication CSS** - Styles inline dupliquant le fichier CSS externe, causant des conflits
4. **Capitalisation incohérente** - Noms d'items standardisés ("Celestial Warfare Key" au lieu de "Celestial Warfare key")

## 📝 Licence

Ce projet est open-source et destiné à la communauté ARK: Primal Descended.

## 🙏 Crédits

Développé avec ❤️ pour la communauté ARK.

---

**Version:** 2.0.0
**Dernière mise à jour:** Janvier 2026
