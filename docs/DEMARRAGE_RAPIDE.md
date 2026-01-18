# 🚀 Démarrage Rapide - 2 Minutes

## 1️⃣ Lancer l'Application (30 secondes)

### Windows
```bash
cd C:\CODE\Calculator_descended
python -m http.server 8000
```

### Mac/Linux
```bash
cd /path/to/Calculator_descended
python3 -m http.server 8000
```

### Puis ouvrir dans le navigateur
```
http://localhost:8000
```

---

## 2️⃣ Utilisation Basique (1 minute)

1. **Sélectionner un tier**
   - Cliquez sur `+` à côté de "T4 Abyssal"
   - Ou tapez un nombre directement dans l'input

2. **Voir les résultats**
   - Les ressources nécessaires s'affichent automatiquement en dessous

3. **Réinitialiser**
   - Bouton "Réinitialiser tout" en bas

---

## 3️⃣ Fonctionnalités Principales

| Action | Comment |
|--------|---------|
| **Changer le thème** | Clic sur 🌙/☀️ (coin haut-droit) |
| **Exporter config** | Clic "Exporter" OU `Ctrl+E` |
| **Importer config** | Clic "Importer" OU `Ctrl+I` |
| **Copier résultats** | Clic "Copier Résultats" OU `Ctrl+Shift+C` |
| **Clear un tier** | Clic sur `✕` à côté du tier |

---

## 4️⃣ Calcul Exemple

**Exemple: Calculer pour 3× T4_Abyssal**

1. Mettez T4_Abyssal = 3
2. Résultats attendus:
   - Artefact: **6** (2×3)
   - Devilish Soul: **36** (12×3)
   - Devilish Hide: **1500** (500×3)
   - Black Pearl: **1500** (500×3)
   - Devilish Essence: **3** (1×3)
   - Abyssal Energy: **30** (10×3)
   - Excellent Soul: **60** (20×3)
   - Unreal Essence: **150** (50×3)
   - Ancient Token Cluster: **3** (1×3)

---

## ✅ C'est Tout!

Vos sélections sont **sauvegardées automatiquement**.
Rafraîchissez la page → tout est restauré.

---

## 📚 Documentation Complète

- `README.md` - Documentation générale
- `TEST.md` - Guide de test complet
- `CHANGEMENTS.md` - Liste des améliorations
- `COMPARAISON.md` - Avant/Après détaillé
- `DEPLOIEMENT.md` - Guide de déploiement web

---

## 🆘 Problème?

**Les icônes ne s'affichent pas?**
→ Vérifiez que vous utilisez un serveur HTTP (pas file://)

**Erreur CORS?**
→ Utilisez `python -m http.server`, pas de double-clic sur index.html

**localStorage ne marche pas?**
→ Utilisez http://localhost, pas file://

---

**Version:** 2.0.0 | **Dernière mise à jour:** Janvier 2026
