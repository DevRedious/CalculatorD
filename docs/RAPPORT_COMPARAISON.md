# Rapport de Comparaison Excel vs Site

## Résumé

**Date:** 2026-01-17
**Fichier Excel:** `Copie de Descended calculator v1.xlsx`
**Fichier Site:** `js/database.js`

## Résultats Globaux

- ✅ **37 items** chargés depuis le site
- ✅ **37 items** chargés depuis l'Excel
- ✅ **220 correspondances** identiques
- ❌ **2 différences** trouvées

## Différences Détectées

### 1. Combat Essence - T7_DodoBleu
- **Site:** 10
- **Excel:** ABSENT (NaN)
- **Statut:** ⚠️ Valeur présente dans le site mais absente de l'Excel

### 2. Combat Essence - T7_DodoRouge
- **Site:** 10
- **Excel:** ABSENT (NaN)
- **Statut:** ⚠️ Valeur présente dans le site mais absente de l'Excel

## Analyse

Dans le fichier Excel, la ligne "Combat Essence" contient les valeurs suivantes :
- T4_Abyssal: 10 ✅
- T4_Celestial: 10 ✅
- T5_Nidhogg: 10 ✅
- T5_Chaos: 10 ✅
- T5_Order: 10 ✅
- T7_WReaper: 10 ✅
- T7_WGiga: 10 ✅
- **T7_DodoBleu: ABSENT** ❌
- **T7_DodoRouge: ABSENT** ❌

Dans le site (`database.js`), Combat Essence a des valeurs pour tous les tiers ci-dessus, y compris T7_DodoBleu et T7_DodoRouge (10 chacun).

## Recommandations

1. **Vérifier la source de vérité:** Déterminer si les valeurs pour T7_DodoBleu et T7_DodoRouge doivent être présentes ou non.

2. **Si l'Excel est la source de vérité:** 
   - Supprimer les valeurs T7_DodoBleu et T7_DodoRouge de `database.js`

3. **Si le site est la source de vérité:**
   - Ajouter les valeurs 10 pour T7_DodoBleu et T7_DodoRouge dans l'Excel

## Conclusion

Les données sont **quasiment identiques** avec seulement 2 différences mineures concernant Combat Essence pour deux tiers spécifiques (T7_DodoBleu et T7_DodoRouge). Toutes les autres valeurs correspondent parfaitement entre l'Excel et le site.
