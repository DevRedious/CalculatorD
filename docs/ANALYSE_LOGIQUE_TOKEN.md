# Analyse de la Logique Ancient Token Calculator

## 📋 Résumé Exécutif

Le calculateur d'Ancient Token Cluster fonctionne avec une logique simple :
- **Entrée** : Nombre d'Ancient Token Cluster souhaités
- **Sortie** : Tokens nécessaires + Ressources nécessaires

## 🔍 Structure du Tableau Excel

### Colonnes Principales

| Colonne | Nom | Description |
|---------|-----|-------------|
| B | Compos | Nom des composants (tokens ou ressources) |
| C | Token/Quantité | Quantité nécessaire calculée |
| C23 | Nombre | **Entrée utilisateur** - Nombre d'Ancient Token Cluster souhaités |
| G | Nombre de mobs | Calcul: `nombre_tokens / 20` |

### Formules ArrayFormula

Les colonnes C utilisent des formules ArrayFormula qui multiplient les valeurs de référence par le nombre de clusters :

- **Colonne C (Tokens)** : `=Feuille1!C98:C106*$G$3` (mais semble utiliser C23 dans la pratique)
- **Colonne C (Ressources)** : `=Feuille1!F98:F103*$C$23`

## 📊 Logique de Calcul

### 1. TOKENS NÉCESSAIRES

**Entrée utilisateur** : Cellule C23 (nombre d'Ancient Token Cluster souhaités)

**Calcul** :
```
Pour chaque token i :
  quantité_token_i = 2 × nombre_clusters
```

**Tokens disponibles** :
- Raptor Token : **2** par cluster
- Carno Token : **2** par cluster
- Bronto Token : **2** par cluster
- Giga Token : **2** par cluster
- Rex Token : **2** par cluster
- Trike Token : **2** par cluster
- Stego Token : **2** par cluster
- Quetz Token : **2** par cluster
- Wyvern Token : **2** par cluster

**Nombre de mobs à faire** :
```
nombre_mobs = nombre_tokens / 20
```

### 2. RESSOURCES NÉCESSAIRES

**Entrée utilisateur** : Cellule C23 (nombre d'Ancient Token Cluster souhaités)

**Calcul** :
```
Pour chaque ressource i :
  quantité_ressource_i = coût_par_cluster_i × nombre_clusters
```

**Coûts par Ancient Token Cluster** :
- Black Pearl : **80** par cluster
- Excellent Essence : **100** par cluster
- Unreal Essence : **20** par cluster
- Excellent Soul : **5** par cluster
- Descended Essence : **200** par cluster
- Artifact : **1** par cluster

## 📈 Exemple de Calcul

### Exemple : Craft de 5 Ancient Token Clusters

**Entrée** : C23 = 5

**Résultats - Tokens** :
- Raptor Token : 2 × 5 = **10**
- Carno Token : 2 × 5 = **10**
- Bronto Token : 2 × 5 = **10**
- Giga Token : 2 × 5 = **10**
- Rex Token : 2 × 5 = **10**
- Trike Token : 2 × 5 = **10**
- Stego Token : 2 × 5 = **10**
- Quetz Token : 2 × 5 = **10**
- Wyvern Token : 2 × 5 = **10**

**Nombre de mobs à faire** : 10 / 20 = **0.5** (arrondi à 1)

**Résultats - Ressources** :
- Black Pearl : 80 × 5 = **400**
- Excellent Essence : 100 × 5 = **500**
- Unreal Essence : 20 × 5 = **100**
- Excellent Soul : 5 × 5 = **25**
- Descended Essence : 200 × 5 = **1000**
- Artifact : 1 × 5 = **5**

## 🎯 Points Clés à Retenir

1. **Multiplication simple** : Les coûts sont multipliés directement par le nombre de clusters
2. **Tous les tokens coûtent 2** : Chaque token nécessite 2 unités par cluster
3. **Ressources variables** : Chaque ressource a un coût différent par cluster
4. **Calcul des mobs** : Division par 20 pour obtenir le nombre de mobs à faire

## 🔄 Différences avec les autres Calculateurs

| Aspect | Boss Calculator | Key Calculator | Token Calculator |
|--------|----------------|----------------|------------------|
| **Entrée** | Sélection de tiers (T4-T9) | Nombre de clés souhaitées | Nombre de clusters souhaités |
| **Calcul** | Somme des coûts par tier | Multiplication par nombre de clés | Multiplication par nombre de clusters |
| **Structure** | Tiers → Items | Clés → Composants | Clusters → Tokens + Ressources |
| **Complexité** | Multi-tiers | Mono-entrée | Mono-entrée |

## 💡 Recommandations pour l'Implémentation

1. **Interface utilisateur** :
   - 1 champ de saisie pour le nombre d'Ancient Token Cluster
   - Affichage des résultats par catégorie (Tokens et Ressources)

2. **Structure de données** :
   - Créer une structure pour les coûts des tokens (tous à 2)
   - Créer une structure pour les coûts des ressources

3. **Calcul** :
   - Implémenter la multiplication simple pour les tokens (× 2)
   - Implémenter la multiplication pour les ressources (coûts variables)
   - Optionnel : Calculer le nombre de mobs (division par 20)

4. **Affichage** :
   - Grouper les résultats par type (Tokens vs Ressources)
   - Afficher le total par composant
