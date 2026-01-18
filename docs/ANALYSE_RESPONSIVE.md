# Analyse du Comportement Responsive

## Vue d'ensemble des Breakpoints

Le site utilise **18 breakpoints** différents pour gérer la responsive :

| Breakpoint | Largeur max | Usage principal |
|------------|-------------|-----------------|
| 1200px | ≤1200px | Passage en colonne unique |
| 900px | ≤900px | Tablette paysage |
| 768px | ≤768px | Tablette portrait / Menu hamburger |
| 700px | ≤700px | Grand mobile |
| 600px | ≤600px | Mobile (optimisations principales) |
| 480px | ≤480px | Petit mobile |

---

## 1. Structure du Container Principal

### Desktop (>1200px)
```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 2 colonnes */
  gap: 1rem;
}
```
- **Calculator** : Colonne gauche
- **Results** : Colonne droite
- Layout côte à côte

### ≤1200px
```css
.container {
  grid-template-columns: 1fr; /* 1 colonne */
  padding: 0.5rem 0.8rem;
  overflow-x: auto; /* Scroll horizontal si zoom */
}
```
- **Calculator** : En haut
- **Results** : En bas
- Passage en colonne unique avec scroll horizontal si nécessaire

---

## 2. Grille des Cartes (Tiers Grid)

### Desktop
```css
.tiers-grid {
  grid-template-columns: repeat(auto-fill, minmax(min(160px, 100%), 1fr));
  gap: 0.6rem;
}
```
- **Comportement** : Colonnes flexibles avec minimum 160px
- **Adaptation** : S'adapte automatiquement à la largeur disponible
- **Zoom** : Utilise `min()` pour permettre le rétrécissement lors du zoom

### ≤900px
- Gap réduit
- Colonnes plus serrées

### ≤768px
- Grid reste fonctionnel mais avec moins de colonnes
- Cartes peuvent passer en colonne unique si nécessaire

### ≤600px
- Padding réduit sur les cartes
- Gap réduit entre les cartes
- Scroll fluide activé (`-webkit-overflow-scrolling: touch`)

### ≤480px
- Padding encore plus réduit
- Gap minimal

---

## 3. Cartes (Tier Cards)

### Structure d'une carte
```
┌─────────────────────┐
│ [Icon] Nom         │
│        [TIER X]    │
│                     │
│  [-] [0] [+]       │
└─────────────────────┘
```

### Desktop
- **Padding** : 1rem
- **Min-height** : 120px
- **Layout** : Flex horizontal (icon + contenu)
- **Counter** : À droite

### ≤900px
- Padding légèrement réduit
- Font-size réduit

### ≤768px
- **Layout** : Flex vertical (icon en haut)
- **Counter** : En bas, centré
- Min-height ajusté

### ≤600px
```css
.tier {
  padding: 0.9rem 0.7rem;
  min-height: 110px;
  touch-action: manipulation;
  flex-direction: column;
}
```
- **Padding réduit** : 0.9rem 0.7rem
- **Min-height** : 110px
- **Touch-action** : Optimisé pour le tactile
- **Layout** : Colonne verticale

### ≤480px
- Padding encore plus réduit : 0.8rem
- Min-height : 105px
- Font-size réduit

---

## 4. Counter (Boutons + Input)

### Structure
```
[−] [0] [+]
```

### Desktop
```css
.counter button {
  width: 44px;
  height: 44px;
  font-size: 16px;
}

.counter input {
  width: 50px;
  font-size: 0.85rem;
}
```
- **Boutons** : 44x44px (WCAG 2.5.5)
- **Input** : 50px de largeur
- **Font-size** : 16px pour les boutons

### ≤900px
- Boutons : 44x44px (inchangé)
- Input : 50px (inchangé)

### ≤768px
- Boutons : 44x44px (inchangé)
- Input : 50px (inchangé)

### ≤700px (Cartes Key/Token uniquement)
```css
.tier[data-key-type] .counter button {
  width: 42px;
  height: 42px;
  font-size: 16px;
}

.tier[data-key-type] .counter input {
  width: 58px;
  font-size: 0.85rem;
  min-width: 45px;
  max-width: 70px;
}
```
- **Boutons** : 42x42px
- **Input** : 58px avec min/max
- **Font-size** : Réduit

### ≤600px
```css
.counter button {
  width: var(--touch-target-md); /* 48px */
  height: var(--touch-target-md);
  font-size: 22px;
  min-width: 44px;
  min-height: 44px;
  touch-action: manipulation;
}

.counter input {
  width: 60px;
  font-size: 1rem; /* Taille lisible */
  padding: 0.4rem;
  min-width: 50px;
}
```
- **Boutons** : 48x48px (augmenté pour le tactile)
- **Input** : 60px avec padding optimisé
- **Font-size** : 1rem pour lisibilité
- **Touch-action** : Optimisé

### ≤480px
- Boutons : 44x44px (minimum WCAG)
- Input : 50px
- Font-size : Réduit

---

## 5. Header et Navigation

### Desktop
```css
.header-content {
  display: flex;
  justify-content: space-between;
  height: 50px;
}

.calculator-nav {
  display: flex; /* Visible */
}

.mobile-menu-btn {
  display: none; /* Masqué */
}
```
- **Navigation desktop** : Visible
- **Menu hamburger** : Masqué

### ≤900px
- Navigation desktop : Wrap possible
- Boutons : Taille réduite

### ≤768px
```css
.mobile-menu-btn {
  display: flex; /* Affiché */
}

.calculator-nav {
  display: none; /* Masqué */
}
```
- **Navigation desktop** : Masquée
- **Menu hamburger** : Affiché
- **Menu mobile** : Disponible en overlay

### ≤600px
```css
.header-content {
  flex-direction: row;
  flex-wrap: wrap;
}

.header-actions {
  width: 100%;
  order: 3;
}
```
- **Layout** : Flex wrap
- **Header actions** : Pleine largeur en bas
- **Logo** : En haut à gauche
- **Theme toggle** : En haut à droite
- **Menu hamburger** : À côté du theme toggle

---

## 6. Résultats (Results Section)

### Desktop
```css
#results-section {
  padding: 1rem;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}
```
- **Padding** : 1rem
- **Scroll** : Vertical si nécessaire
- **Max-height** : Calculé dynamiquement

### ≤1200px
```css
#results-section {
  margin-top: 1rem;
  order: 2; /* En bas */
  max-width: 100%;
}
```
- **Position** : En bas (order: 2)
- **Max-width** : 100%

### ≤600px
```css
#results-section {
  padding: 0.6rem 0.5rem;
  margin-top: 0.8rem;
}
```
- **Padding réduit** : 0.6rem 0.5rem
- **Margin-top** : 0.8rem

### ≤480px
```css
#results-section {
  padding: 0.5rem;
}

.result {
  font-size: 13px;
  padding: 0.35rem 0.5rem;
}
```
- **Padding minimal** : 0.5rem
- **Font-size** : 13px
- **Images** : 24x24px

---

## 7. Gestion du Zoom

### Problèmes résolus
1. **Overflow hidden** → **Overflow auto**
   ```css
   body, .container, section {
     overflow-x: auto; /* Au lieu de hidden */
   }
   ```

2. **Grid-template-columns flexible**
   ```css
   grid-template-columns: repeat(auto-fill, minmax(min(160px, 100%), 1fr));
   ```
   - Utilise `min()` pour permettre le rétrécissement

3. **Min-width: 0** sur les flex/grid items
   ```css
   .tier, .counter {
     min-width: 0; /* Permet le rétrécissement */
   }
   ```

4. **Box-sizing: border-box** partout
   ```css
   * {
     box-sizing: border-box;
   }
   ```

---

## 8. Optimisations Tactiles (Mobile)

### Touch Targets
```css
.counter button {
  min-width: 44px; /* WCAG 2.5.5 */
  min-height: 44px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: rgba(204, 0, 0, 0.2);
}
```

### Scroll Fluide (iOS)
```css
#calculator {
  -webkit-overflow-scrolling: touch;
}
```

### Font-size Mobile
```css
body {
  font-size: 14px; /* ≤600px */
  font-size: 13px; /* ≤480px */
}
```

---

## 9. Cartes Spéciales (Key/Token)

### Comportement différent
```css
.tiers-container-keys {
  display: flex;
  flex-direction: column; /* Au lieu de grid */
}
```

### Responsive spécifique
- **≤900px** : Padding réduit
- **≤768px** : Icon 48px → 46px
- **≤700px** : Boutons 44px → 42px, Input 58px
- **≤600px** : Boutons 44px, Input 65px
- **≤480px** : Boutons 42px, Input 58px

---

## 10. Points d'Attention

### ✅ Points forts
1. **Breakpoints progressifs** : Adaptation graduelle
2. **Touch targets** : Respect WCAG 2.5.5 (44x44px minimum)
3. **Scroll fluide** : Optimisé pour iOS
4. **Zoom compatible** : Overflow auto au lieu de hidden
5. **Flexible grid** : Utilise `min()` pour adaptation

### ⚠️ Points à surveiller
1. **Multiples breakpoints** : 18 breakpoints peuvent créer de la complexité
2. **Styles spécifiques Key/Token** : Nécessitent une maintenance séparée
3. **Font-size réduit** : Peut affecter la lisibilité sur très petits écrans
4. **Counter responsive** : Différentes tailles selon le type de carte

### 🔧 Recommandations
1. **Consolider les breakpoints** : Réduire à 4-5 breakpoints principaux
2. **Variables CSS** : Utiliser plus de variables pour les tailles
3. **Tests** : Tester sur différents appareils réels
4. **Performance** : Vérifier le rendu sur appareils moins puissants

---

## 11. Ordre d'Application des Styles

Les media queries sont appliquées dans cet ordre :

1. **Base styles** (Desktop)
2. **≤1200px** : Passage en colonne
3. **≤900px** : Tablette paysage
4. **≤768px** : Tablette portrait / Menu hamburger
5. **≤700px** : Grand mobile
6. **≤600px** : Mobile (optimisations principales)
7. **≤480px** : Petit mobile

**Important** : Les styles plus spécifiques (≤480px) écrasent les styles moins spécifiques (≤600px).

---

## 12. Exemple de Cascade Responsive

### Counter Button
```css
/* Desktop */
.counter button { width: 44px; height: 44px; }

/* ≤600px */
.counter button { width: 48px; height: 48px; }

/* ≤480px */
.counter button { width: 44px; height: 44px; }
```

**Résultat** :
- Desktop : 44x44px
- 600px-481px : 48x48px (plus grand pour le tactile)
- ≤480px : 44x44px (retour au minimum)

---

## Conclusion

Le système responsive est **bien structuré** avec des adaptations progressives. Les principales optimisations concernent :

1. **Layout** : Passage de 2 colonnes à 1 colonne
2. **Navigation** : Menu hamburger sur mobile
3. **Cartes** : Adaptation des tailles et padding
4. **Counter** : Tailles optimisées pour le tactile
5. **Zoom** : Gestion de l'overflow pour éviter les problèmes

Le code est **maintenable** mais pourrait bénéficier d'une **consolidation des breakpoints** et d'une **utilisation accrue de variables CSS**.
