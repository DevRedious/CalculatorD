# Analyse de la Logique Key Calculator

## 📋 Résumé Exécutif

Le calculateur de clés dans l'Excel fonctionne avec **3 types de craft** :
1. **CRAFT NORMAL - Abyssal Warfare Key**
2. **CRAFT NORMAL - Celestial Warfare Key**  
3. **CRAFT GOD KEY**

## 🔍 Structure du Tableau Excel

### Colonnes Principales

| Colonne | Nom | Description |
|---------|-----|-------------|
| A (1) | TOTAL | `=SUM(C:E)` - Somme des colonnes C, D, E |
| B (2) | Compos | Nom des composants nécessaires |
| C (3) | Abyssal Warfare Key | Quantité nécessaire pour Abyssal Key |
| D (4) | Celestial Warfare Key | Quantité nécessaire pour Celestial Key |
| E (5) | Abyssal (6) + Celestial (6) | Quantité nécessaire pour God Key |
| H (8) | Nombre | **Entrée utilisateur** - Nombre de clés souhaitées |
| J (10) | God Key | `=SUM(H/6)` - Calcul des God Keys |

### Formules ArrayFormula

Les colonnes C, D, E utilisent des formules ArrayFormula qui multiplient les valeurs de référence par le nombre de clés :

- **Colonne C** : `=Feuille1!C55:C94*$H$6` (Abyssal Key)
- **Colonne D** : `=Feuille1!D55:D94*$H$8` (Celestial Key)
- **Colonne E** : `=Feuille1!E55:E94*$H$11` (God Key)

## 📊 Logique de Calcul

### 1. CRAFT NORMAL - Abyssal Warfare Key

**Entrée utilisateur** : Cellule H6 (nombre de clés Abyssal souhaitées)

**Calcul** :
```
Pour chaque composant i :
  quantité_i = valeur_référence_i × nombre_clés_abyssal
```

**Valeurs de référence** : Feuille1, colonne C, lignes 55-94

**Exemples de coûts par clé** :
- Abyssal Carcha Trophy : **3** par clé
- Abyssal Dodoreaper Trophy : **3** par clé
- Abyssal Dodorexy Trophy : **3** par clé
- Abyssal Drake Trophy : **3** par clé
- Abyssal Indominus Rex Trophy : **3** par clé
- Abyssal Manticore Trophy : **3** par clé
- Abyssal Spider Trophy : **3** par clé
- Abyssal Element : **3** par clé
- Abyssal Energy : **300** par clé
- Element : **500** par clé
- Black Pearl : **500** par clé
- Oracle Essence : **100** par clé

### 2. CRAFT NORMAL - Celestial Warfare Key

**Entrée utilisateur** : Cellule H8 (nombre de clés Celestial souhaitées)

**Calcul** :
```
Pour chaque composant i :
  quantité_i = valeur_référence_i × nombre_clés_celestial
```

**Valeurs de référence** : Feuille1, colonne D, lignes 55-94

**Exemples de coûts par clé** :
- Celestial Gigant Trophy : **3** par clé
- Celestial Gorilla Trophy : **3** par clé
- Celestial Rhynio Trophy : **3** par clé
- Celestial Rock Golem trophy : **3** par clé
- Celestial Rock Drake Trophy : **3** par clé
- Celestial Titano Trophy : **3** par clé
- Celestial Wyvern Trophy : **3** par clé
- Celestial Element : **3** par clé
- Celestial Energy : **300** par clé
- Element : **500** par clé
- Black Pearl : **500** par clé
- Oracle Essence : **100** par clé

### 3. CRAFT GOD KEY

**Entrée utilisateur** : Cellule H11 (nombre de clés souhaitées)

**Calcul** :
```
nombre_god_keys = nombre_clés / 6

Pour chaque composant i :
  quantité_i = valeur_référence_i × nombre_god_keys
```

**Valeurs de référence** : Feuille1, colonne E, lignes 55-94

**Exemples de coûts par God Key** :
- Abyssal Energy : **200** par God Key
- Celestial Energy : **200** par God Key
- Ancient Token Cluster : **1** par God Key
- Unreal Essence : **500** par God Key
- Tous les Souls (Abyssal et Celestial) : **5** par God Key

## 📈 Exemple de Calcul

### Exemple 1 : Craft de 10 Abyssal Warfare Keys

**Entrée** : H6 = 10

**Résultats** :
- Abyssal Carcha Trophy : 3 × 10 = **30**
- Abyssal Energy : 300 × 10 = **3000**
- Element : 500 × 10 = **5000**
- Oracle Essence : 100 × 10 = **1000**

### Exemple 2 : Craft de 6 God Keys

**Entrée** : H11 = 6

**Calcul** : nombre_god_keys = 6 / 6 = **1 God Key**

**Résultats** :
- Abyssal Energy : 200 × 1 = **200**
- Celestial Energy : 200 × 1 = **200**
- Ancient Token Cluster : 1 × 1 = **1**
- Abyssal Carcha Soul : 5 × 1 = **5**
- Celestial Gigant Soul : 5 × 1 = **5**

## 🎯 Points Clés à Retenir

1. **Multiplication simple** : Les coûts sont multipliés directement par le nombre de clés
2. **God Key = Division par 6** : Le nombre de clés est divisé par 6 pour obtenir le nombre de God Keys
3. **Valeurs de référence fixes** : Les coûts par clé sont définis dans Feuille1, colonnes C, D, E
4. **3 entrées utilisateur** : H6 (Abyssal), H8 (Celestial), H11 (God Key)

## 🔄 Différences avec le Boss Calculator

| Aspect | Boss Calculator | Key Calculator |
|--------|----------------|---------------|
| **Entrée** | Sélection de tiers (T4-T9) | Nombre de clés souhaitées |
| **Calcul** | Somme des coûts par tier | Multiplication par nombre de clés |
| **Structure** | Tiers → Items | Clés → Composants |
| **Complexité** | Multi-tiers | Mono-entrée |

## 💡 Recommandations pour l'Implémentation

1. **Interface utilisateur** :
   - 3 champs de saisie pour les nombres de clés (Abyssal, Celestial, God Key)
   - Affichage des résultats par composant

2. **Structure de données** :
   - Créer une nouvelle structure pour les coûts de référence des clés
   - Séparer les coûts Abyssal, Celestial et God Key

3. **Calcul** :
   - Implémenter la multiplication simple pour Abyssal et Celestial
   - Implémenter la division par 6 pour God Key

4. **Affichage** :
   - Grouper les résultats par type de craft
   - Afficher le total par composant si plusieurs types sont sélectionnés
