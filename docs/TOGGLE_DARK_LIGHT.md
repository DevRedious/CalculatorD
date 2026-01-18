# 🌓 Toggle Dark/Light - Documentation

## Vue d'ensemble

Le calculateur utilise maintenant un magnifique toggle animé pour changer de thème, créé par JkHuger sur [Uiverse.io](https://uiverse.io).

## Caractéristiques

### ✨ Visuelles
- **Animation fluide** avec cubic-bezier pour un mouvement naturel
- **Icônes vectorielles** (soleil ☀️ et lune 🌙) via Iconify
- **Transition élégante** du bouton qui coulisse de gauche à droite
- **Rotation des icônes** pour un effet dynamique
- **Ombres portées** pour un effet de profondeur

### 🎯 Fonctionnelles
- **Sauvegarde automatique** du thème dans localStorage
- **Synchronisation** entre le toggle et le thème actuel
- **Accessible au clavier** (Tab + Espace/Enter)
- **ARIA label** pour les lecteurs d'écran
- **Responsive** - s'adapte sur mobile

## Structure HTML

```html
<div id="themeToggleContainer">
    <label>
        <input id="themeToggle" class="toggle-checkbox" type="checkbox" aria-label="Changer de thème">
        <div class="toggle-slot">
            <div class="sun-icon-wrapper">
                <div class="iconify sun-icon" data-icon="feather-sun" data-inline="false"></div>
            </div>
            <div class="toggle-button"></div>
            <div class="moon-icon-wrapper">
                <div class="iconify moon-icon" data-icon="feather-moon" data-inline="false"></div>
            </div>
        </div>
    </label>
</div>
```

### Éléments

1. **toggle-checkbox** - Input checkbox caché (opacity: 0)
2. **toggle-slot** - Conteneur avec fond blanc/gris selon le thème
3. **sun-icon-wrapper** - Icône soleil (visible en mode light)
4. **toggle-button** - Bouton rond qui coulisse
5. **moon-icon-wrapper** - Icône lune (visible en mode dark)

## CSS Principal

### Variables importantes

```css
/* Taille de base (ajustable via font-size) */
.toggle-slot {
  font-size: 10px;  /* Modifier cette valeur pour changer la taille du toggle */
  height: 3.5em;
  width: 7em;
}

/* Responsive */
@media (max-width: 600px) {
  .toggle-slot {
    font-size: 8px;  /* Plus petit sur mobile */
  }
}
```

### États

#### Mode Light (unchecked)
- Fond blanc
- Soleil visible et en rotation (15deg)
- Bouton à gauche avec ombre jaune (#ffbb52)
- Lune cachée hors de vue (translate 11em)

#### Mode Dark (checked)
- Fond gris foncé (#374151)
- Lune visible et en rotation (-15deg)
- Bouton à droite avec ombre blanche
- Soleil caché (opacity: 0)

## JavaScript

### ThemeManager

```javascript
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('calculator_theme') || 'dark';
    this.toggleCheckbox = document.getElementById('themeToggle');
    this.init();
  }

  init() {
    this.apply();
    if (this.toggleCheckbox) {
      // Écouter le changement de la checkbox
      this.toggleCheckbox.addEventListener('change', () => this.toggle());
    }
  }

  toggle() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    this.apply();
    localStorage.setItem('calculator_theme', this.theme);
  }

  apply() {
    document.documentElement.setAttribute('data-theme', this.theme);
    if (this.toggleCheckbox) {
      // Synchroniser la checkbox avec le thème
      this.toggleCheckbox.checked = (this.theme === 'dark');
    }
  }
}
```

### Logique

- **checked = true** → Mode Dark (lune visible)
- **checked = false** → Mode Light (soleil visible)

## Animations

### Bouton coulissant

```css
.toggle-button {
  transition: transform 500ms cubic-bezier(.26, 2, .46, .71);
}

/* Position initiale (light) */
transform: translate(0.3em, 0.25em);

/* Position finale (dark) */
transform: translate(3.65em, 0.25em);
```

Le cubic-bezier `.26, 2, .46, .71` crée un effet de "rebond" élégant.

### Icônes

```css
/* Soleil */
.sun-icon-wrapper {
  transition: opacity 150ms, transform 500ms cubic-bezier(.26, 2, .46, .71);
}

/* Light mode */
opacity: 1;
transform: translate(2em, 2em) rotate(15deg);

/* Dark mode */
opacity: 0;
transform: translate(3em, 2em) rotate(0deg);
```

```css
/* Lune */
.moon-icon-wrapper {
  transition: opacity 150ms, transform 500ms cubic-bezier(.26, 2.5, .46, .71);
}

/* Light mode */
opacity: 0;
transform: translate(11em, 2em) rotate(0deg);

/* Dark mode */
opacity: 1;
transform: translate(2em, 2em) rotate(-15deg);
```

## Personnalisation

### Changer la taille

Modifiez `font-size` de `.toggle-slot`:

```css
.toggle-slot {
  font-size: 12px;  /* Plus grand */
}
```

Tout est en `em`, donc tout s'adapte proportionnellement.

### Changer les couleurs

#### Mode Light
```css
.toggle-slot {
  background-color: white;  /* Fond du slot */
}

.toggle-button {
  background-color: #ffeccf;  /* Fond du bouton */
  box-shadow: inset 0px 0px 0px 0.75em #ffbb52;  /* Ombre jaune */
}

.sun-icon {
  color: #ffbb52;  /* Couleur du soleil */
}
```

#### Mode Dark
```css
.toggle-checkbox:checked ~ .toggle-slot {
  background-color: #374151;  /* Fond du slot */
}

.toggle-checkbox:checked ~ .toggle-slot .toggle-button {
  background-color: #485367;  /* Fond du bouton */
  box-shadow: inset 0px 0px 0px 0.75em white;  /* Ombre blanche */
}

.moon-icon {
  color: white;  /* Couleur de la lune */
}
```

### Changer la position

Par défaut, le toggle est en position fixe (coin haut-droit):

```css
#themeToggleContainer {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}
```

Pour le déplacer:
```css
#themeToggleContainer {
  top: 100px;     /* Plus bas */
  left: 20px;     /* À gauche */
  right: auto;    /* Enlever right */
}
```

## Dépendances

### Iconify

```html
<script src="https://code.iconify.design/1/1.0.7/iconify.min.js"></script>
```

Cette bibliothèque charge les icônes vectorielles Feather:
- `feather-sun` - Icône soleil
- `feather-moon` - Icône lune

**Alternative sans Iconify:**

Remplacez les divs Iconify par des SVG ou des émojis:

```html
<!-- Avec émojis -->
<div class="sun-icon">☀️</div>
<div class="moon-icon">🌙</div>

<!-- Ou avec SVG inline -->
<svg class="sun-icon" viewBox="0 0 24 24">...</svg>
```

## Accessibilité

### ARIA

```html
<input
  id="themeToggle"
  class="toggle-checkbox"
  type="checkbox"
  aria-label="Changer de thème"
>
```

Le label est mis à jour dynamiquement:
- Mode Dark: "Activer le thème clair"
- Mode Light: "Activer le thème sombre"

### Navigation clavier

1. **Tab** - Focus sur le toggle
2. **Espace** ou **Enter** - Active/désactive
3. Le focus est visible (outline natif du navigateur)

### Lecteurs d'écran

Annonce:
- "Changer de thème, case à cocher, cochée" (dark mode)
- "Changer de thème, case à cocher, non cochée" (light mode)

## Test

### Page de test

Ouvrez `TEST_TOGGLE.html` pour tester le toggle:

```bash
python -m http.server 8000
# http://localhost:8000/TEST_TOGGLE.html
```

Cette page affiche:
- Le toggle en action
- Le thème actuel
- Les variables CSS en temps réel
- Instructions et caractéristiques

### Checklist de test

- [ ] Cliquer sur le toggle change le thème
- [ ] Le bouton coulisse de gauche à droite
- [ ] Le soleil disparaît, la lune apparaît (ou vice-versa)
- [ ] L'animation est fluide (pas saccadée)
- [ ] Le thème est sauvegardé (refresh page → thème préservé)
- [ ] Navigation clavier fonctionne (Tab + Espace)
- [ ] Sur mobile, le toggle est plus petit mais fonctionnel

## Crédits

- **Design original**: [JkHuger sur Uiverse.io](https://uiverse.io)
- **Icônes**: [Iconify - Feather Icons](https://iconify.design)
- **Intégration**: Calculateur ARK Primal Descended

## Licence

Le design du toggle est sous licence Creative Commons (Uiverse.io).
Libre d'utilisation et de modification.

---

**Profitez de ce magnifique toggle! 🌓✨**
