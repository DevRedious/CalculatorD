# -*- coding: utf-8 -*-
import os
import re

# Lire database.js pour extraire les noms d'icônes
with open('js/database.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extraire tous les noms d'icônes avec un pattern plus précis
# Format: icon: `${ICONS_PATH}nom_icone.png`
icon_pattern = r'icon:\s*`\$\{ICONS_PATH\}([^`]+\.png)`'
referenced_icons = set(re.findall(icon_pattern, content))

# Lister les icônes présentes dans le dossier
icons_dir = 'icons-20260117T210540Z-1-001/icons'
if os.path.exists(icons_dir):
    existing_icons = set(f for f in os.listdir(icons_dir) if f.endswith('.png'))
else:
    print(f"ERREUR: Le dossier {icons_dir} n'existe pas")
    existing_icons = set()

# Trouver les icônes manquantes
missing_icons = referenced_icons - existing_icons

# Trouver les icônes présentes mais non référencées (optionnel)
unused_icons = existing_icons - referenced_icons

print("="*80)
print("VERIFICATION DES ICONES")
print("="*80)
print()

print(f"Icones referencees dans le code: {len(referenced_icons)}")
print(f"Icones presentes dans le dossier: {len(existing_icons)}")
print()

if missing_icons:
    print(f"ICONES MANQUANTES ({len(missing_icons)}):")
    for icon in sorted(missing_icons):
        print(f"  - {icon}")
    print()
else:
    print("Aucune icone manquante!")
    print()

if unused_icons:
    print(f"Icones non utilisees dans le code ({len(unused_icons)}):")
    for icon in sorted(unused_icons):
        print(f"  - {icon}")
    print()

# Afficher toutes les icônes référencées pour vérification
print("="*80)
print("LISTE COMPLETE DES ICONES REFERENCEES")
print("="*80)
for icon in sorted(referenced_icons):
    status = "OK" if icon in existing_icons else "MANQUANTE"
    print(f"  {icon:<45} [{status}]")
