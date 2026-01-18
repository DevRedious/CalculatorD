# ✅ Test Rapide de l'Application

## Étape 1: Démarrer un Serveur Local

### Option A: Python (Recommandé)
```bash
cd C:\CODE\Calculator_descended
python -m http.server 8000
```

### Option B: Node.js
```bash
cd C:\CODE\Calculator_descended
npx http-server -p 8000
```

Puis ouvrir dans le navigateur: **http://localhost:8000**

---

## Étape 2: Vérifications Visuelles

### ✅ Page Chargée
- [ ] La bannière ARK s'affiche en haut
- [ ] Le titre "ARK: Primal Descended" est visible
- [ ] Le bouton thème (🌙) est visible en haut à droite

### ✅ Navigation
- [ ] Les liens "Calculateur", "Exporter", "Importer", "Copier Résultats" sont visibles
- [ ] La navigation est collante (sticky) lors du scroll

### ✅ Tiers
- [ ] 18 tiers sont affichés en 3 colonnes
- [ ] Chaque tier a:
  - [ ] Une icône PNG visible
  - [ ] Un nom (ex: "T4 Abyssal")
  - [ ] Un bouton `-`
  - [ ] Un input numérique (valeur 0)
  - [ ] Un bouton `+`
  - [ ] Un bouton `✕` (clear)

### ✅ Résultats
- [ ] Section "Ressources Nécessaires" visible
- [ ] Message: "Sélectionnez des tiers pour voir les ressources nécessaires"

---

## Étape 3: Test des Fonctionnalités de Base

### Test 1: Compteurs
1. Cliquez sur `+` pour **T4_Abyssal** 3 fois
   - ✅ Le compteur affiche "3"
   - ✅ Des résultats apparaissent en dessous

2. Cliquez sur `-` une fois
   - ✅ Le compteur affiche "2"
   - ✅ Les résultats sont mis à jour

3. Cliquez dans l'input, tapez "10", appuyez sur Enter
   - ✅ Le compteur affiche "10"
   - ✅ Les résultats sont mis à jour

### Test 2: Validation
1. Tapez "abc" dans un input
   - ✅ L'input affiche une erreur (bordure rouge)
   - ✅ La valeur redevient 0 ou un nombre valide

2. Tapez "-5" dans un input
   - ✅ La valeur est contrainte à 0 (minimum)

3. Tapez "9999" dans un input
   - ✅ La valeur est contrainte à 999 (maximum)

### Test 3: Résultats
1. Avec T4_Abyssal = 10, vérifiez les résultats:
   - ✅ "Artefact: 20" (2 × 10)
   - ✅ "Devilish Soul: 120" (12 × 10)
   - ✅ "Devilish Hide: 5000" (500 × 10)
   - ✅ "Black Pearl: 5000" (500 × 10)
   - ✅ Etc.

2. Les résultats sont triés alphabétiquement
   - ✅ Ordre: A, B, C, D, etc.

### Test 4: Reset
1. Remplissez plusieurs tiers (ex: T4_Abyssal=5, T5_Chaos=3)
2. Cliquez sur "Réinitialiser tout"
   - ✅ Popup de confirmation apparaît
3. Confirmez
   - ✅ Tous les compteurs repassent à 0
   - ✅ Les résultats disparaissent

### Test 5: Clear Individuel
1. Mettez T4_Abyssal = 10
2. Cliquez sur le `✕` à côté de "T4 Abyssal"
   - ✅ Seul T4_Abyssal repasse à 0
   - ✅ Les autres tiers restent inchangés

---

## Étape 4: Test des Fonctionnalités Avancées

### Test 6: Sauvegarde Automatique
1. Mettez T4_Abyssal = 5, T5_Chaos = 3
2. Attendez 2 secondes (pour le debounce)
3. Rafraîchissez la page (F5)
   - ✅ Les valeurs sont restaurées (T4_Abyssal=5, T5_Chaos=3)
   - ✅ Toast: "Configuration restaurée depuis la sauvegarde"

### Test 7: Export
1. Remplissez quelques tiers
2. Cliquez sur "Exporter" dans la navigation
   - ✅ Un fichier JSON est téléchargé
   - ✅ Nom: `ark-calculator-YYYY-MM-DD...json`
   - ✅ Toast: "Configuration exportée avec succès!"

3. Ouvrez le fichier JSON
   - ✅ Contient `{"version": 1, "selection": {...}, "timestamp": ...}`
   - ✅ Les valeurs des tiers sont présentes

### Test 8: Import
1. Réinitialisez tout
2. Cliquez sur "Importer"
   - ✅ Sélecteur de fichier s'ouvre
3. Sélectionnez le fichier JSON exporté précédemment
   - ✅ Les valeurs sont restaurées
   - ✅ Toast: "Configuration importée avec succès!"

### Test 9: Copie des Résultats
1. Remplissez quelques tiers
2. Cliquez sur "Copier Résultats"
   - ✅ Toast: "Résultats copiés dans le presse-papier!"
3. Collez (Ctrl+V) dans un éditeur de texte
   - ✅ Format texte lisible avec liste des items

### Test 10: Thème
1. Cliquez sur le bouton thème (🌙 ou ☀️)
   - ✅ Le thème change (dark ↔ light)
   - ✅ L'icône change (🌙 ↔ ☀️)
   - ✅ Les couleurs de toute la page changent

2. Rafraîchissez la page
   - ✅ Le thème est préservé

### Test 11: Raccourcis Clavier
1. Appuyez sur `Ctrl+E`
   - ✅ Export de la configuration

2. Appuyez sur `Ctrl+I`
   - ✅ Dialog d'import s'ouvre

3. Remplissez des tiers, puis `Ctrl+Shift+C`
   - ✅ Résultats copiés

4. Avec des tiers remplis, appuyez sur `Ctrl+R`
   - ✅ Popup de confirmation
   - ✅ Reset après confirmation

---

## Étape 5: Test d'Accessibilité

### Test 12: Navigation Clavier
1. Appuyez plusieurs fois sur `Tab`
   - ✅ Le focus se déplace logiquement (navigation → boutons → inputs)
   - ✅ Le focus est visible (outline autour de l'élément)

2. Avec le focus sur un bouton, appuyez sur `Enter` ou `Space`
   - ✅ Le bouton s'active

3. Avec le focus sur un input, tapez un nombre et appuyez sur `Enter`
   - ✅ La valeur est validée

### Test 13: Lecteur d'Écran (Optionnel)
Si vous avez NVDA ou JAWS:
1. Activez le lecteur d'écran
2. Naviguez sur les boutons +/-
   - ✅ Annonce: "Augmenter T4 Abyssal, bouton"
   - ✅ Annonce: "Diminuer T4 Abyssal, bouton"

3. Naviguez sur les inputs
   - ✅ Annonce: "Quantité T4 Abyssal, 0, champ numérique"

---

## Étape 6: Test Responsive

### Test 14: Mobile
1. Redimensionnez la fenêtre à 400px de large (ou F12 → Mode responsive)
   - ✅ Les tiers passent en 1 colonne
   - ✅ Les boutons +/- sont assez grands (48×48px minimum)
   - ✅ Les résultats passent en 1 colonne
   - ✅ La bannière s'adapte (hauteur réduite)

### Test 15: Tablette
1. Redimensionnez à 768px
   - ✅ Les tiers passent en 2 colonnes
   - ✅ Les résultats passent en 2 colonnes
   - ✅ Tout reste lisible

### Test 16: Desktop Large
1. Redimensionnez à 1920px
   - ✅ Les tiers restent en 3 colonnes (max 1200px container)
   - ✅ Les résultats restent en 3 colonnes
   - ✅ Centré avec marges

---

## Étape 7: Test Multi-Navigateur

### Test 17: Chrome/Edge
- ✅ Tout fonctionne

### Test 18: Firefox
- ✅ Tout fonctionne

### Test 19: Safari (si Mac)
- ✅ Tout fonctionne

---

## Étape 8: Console & Réseau

### Test 20: Console JavaScript
1. Ouvrez la console (F12 → Console)
   - ✅ Aucune erreur JavaScript
   - ✅ Messages de log: "✅ Calculator initialisé", etc.

### Test 21: Onglet Network
1. Ouvrez F12 → Network
2. Rafraîchissez la page
   - ✅ Tous les fichiers JS chargés (200 OK)
   - ✅ Tous les fichiers CSS chargés (200 OK)
   - ✅ Toutes les icônes PNG chargées (200 OK)
   - ✅ Aucune erreur 404

---

## 🎯 Résultat Attendu

Si tous les tests passent:
- ✅ **100% fonctionnel**
- ✅ **Aucun bug critique**
- ✅ **Prêt pour déploiement**

---

## 🐛 Si Problèmes

### Icônes manquantes (404)
**Vérifier:**
```javascript
// js/config.js, ligne 66
export const ICONS_PATH = "icons-20260117T210540Z-1-001/icons/";
```

**Solution:** Le chemin doit correspondre exactement au nom du dossier.

### Modules ne chargent pas (CORS)
**Erreur:**
```
Access to script from origin 'null' has been blocked by CORS policy
```

**Solution:** Utiliser un serveur HTTP (Python/Node), PAS file://

### localStorage ne fonctionne pas
**Solution:** Utiliser http://localhost, PAS file://

### Styles ne s'appliquent pas
**Vérifier:**
```html
<!-- index.html -->
<link rel="stylesheet" href="css/styles.css">
<!-- PAS de '/' au début -->
```

---

## 📊 Checklist Finale

Avant de déployer en production:

- [ ] Tous les tests ci-dessus passent
- [ ] Console sans erreurs
- [ ] Network sans 404
- [ ] Testé sur 3+ navigateurs
- [ ] Testé sur mobile
- [ ] Performance acceptable (< 1s chargement)
- [ ] Accessibilité vérifiée (navigation clavier)
- [ ] localStorage fonctionne
- [ ] Export/Import fonctionne
- [ ] Toutes les icônes s'affichent

**Si tous les items sont cochés: 🎉 PRÊT POUR DÉPLOIEMENT!**

---

## 🚀 Prochaine Étape

Consultez `DEPLOIEMENT.md` pour déployer sur:
- GitHub Pages (gratuit)
- Netlify (gratuit)
- Vercel (gratuit)

Ou gardez-le en local pour usage personnel.
