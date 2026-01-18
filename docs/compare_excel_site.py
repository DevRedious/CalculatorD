# -*- coding: utf-8 -*-
import pandas as pd
import json
import sys
import re
import os

# Configuration de l'encodage pour Windows
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Mapping des noms de colonnes Excel vers les noms de tiers du site
TIER_MAPPING = {
    'Abyssal': 'T4_Abyssal',
    'Celestial': 'T4_Celestial',
    'Nidhogg': 'T5_Nidhogg',
    'Chaos (rouge)': 'T5_Chaos',
    'Order (blue)': 'T5_Order',
    'Normal': 'T6_Normal',
    'Giga': 'T6_Giga',
    'Dodo Bleu': 'T7_DodoBleu',
    'Dodo Rouge': 'T7_DodoRouge',
    'W. Reaper': 'T7_WReaper',
    'W. Giga': 'T7_WGiga',
    'Ascension': 'T8_Ascension',
    'Descension': 'T8_Descension',
    '1 Seal': 'T9_1Seal',
    '2 Seal': 'T9_2Seal',
    '3 Seal': 'T9_3Seal',
    '4 Seal': 'T9_4Seal',
    'Cube': 'T9_Cube'
}

# Mapping des noms d'items Excel vers les noms du site
ITEM_MAPPING = {
    'Artefact': 'Artefact',
    'Abyssal Warfare Key': 'Abyssal Warfare Key',
    'Celestial Warfare key': 'Celestial Warfare Key',
    'Ancient token Cluster': 'Ancient Token Cluster',
    'Combat Essence': 'Combat Essence',
    'Devilish Soul': 'Devilish Soul',
    'Divine Soul': 'Divine Soul',
    'Devilish Hide': 'Devilish Hide',
    'Divine Hide': 'Divine Hide',
    'Excellent Soul': 'Excellent Soul',
    'Unreal Essence': 'Unreal Essence',
    'Black Pearl': 'Black Pearl',
    'Devilish Essence': 'Devilish Essence',
    'Divin Essence': 'Divine Essence',
    'Abyssal Energy': 'Abyssal Energy',
    'Celestial Energy': 'Celestial Energy',
    'Chaos Warchief Soul': 'Chaos Warchief Soul',
    'Order Warchief Soul': 'Order Warchief Soul',
    'Bionic Essence': 'Bionic Essence',
    'Bionic Soul': 'Bionic Soul',
    'Descended Ingot': 'Descended Ingot',
    'Ascended Warden Essence': 'Ascended Warden Essence',
    'Descended Warden essence': 'Descended Warden Essence',
    'Luminous Essence': 'Luminous Essence',
    'Ancient Essence (Os)': 'Ancient Essence',
    'Bionic Gigant Essence': 'Bionic Giga Essence',
    'Descended Essence': 'Descended Essence',
    'Excellent Essence': 'Excellent Essence',
    'Warden Rex Trophy': 'Warden Rex Trophy',
    'Warden Spino Trophy': 'Warden Spino Trophy',
    'Warden Theri Trophy': 'Warden Theri Trophy',
    'Warden Lizard Trophy': 'Warden Lizard Trophy',
    'Supreme Warden Giga Trophy': 'Supreme Warden Giga Trophy',
    'Supreme Warden Reaper Trophy': 'Supreme Warden Reaper Trophy',
    'Soul of Ascension God': 'Soul of Ascension God',
    'Soul of Descension God': 'Soul of Descension God',
    'Seal Fragments': 'Seal Fragments'
}

def load_site_database():
    """Charge la base de données du site depuis database.js"""
    try:
        with open('js/database.js', 'r', encoding='utf-8') as f:
            content = f.read()
        
        site_data = {}
        
        # Pattern pour extraire chaque item et ses coûts
        # Format: "ItemName": { icon: ..., costs: { "Tier": value, ... } }
        
        # Trouver tous les blocs d'items
        item_pattern = r'"([^"]+)":\s*\{\s*icon:[^,]+,\s*costs:\s*\{([^}]+)\}'
        
        # Utiliser une approche plus simple : parser ligne par ligne
        lines = content.split('\n')
        current_item = None
        current_costs = {}
        in_item = False
        in_costs = False
        
        for line in lines:
            # Détecter le début d'un item
            if '"' in line and ':' in line and '{' in line:
                match = re.search(r'"([^"]+)":\s*\{', line)
                if match:
                    if current_item and current_costs:
                        site_data[current_item] = current_costs.copy()
                    current_item = match.group(1)
                    current_costs = {}
                    in_costs = False
            
            # Détecter le début de costs
            if 'costs:' in line and '{' in line:
                in_costs = True
                # Extraire les coûts de cette ligne si possible
                costs_in_line = re.findall(r'"([^"]+)":\s*(\d+)', line)
                for tier, cost in costs_in_line:
                    current_costs[tier] = int(cost)
                continue
            
            # Lire les coûts
            if in_costs:
                cost_match = re.findall(r'"([^"]+)":\s*(\d+)', line)
                for tier, cost in cost_match:
                    current_costs[tier] = int(cost)
                
                # Fin des costs
                if '}' in line and not ('{' in line and line.count('}') == 1):
                    in_costs = False
        
        # Ajouter le dernier item
        if current_item and current_costs:
            site_data[current_item] = current_costs.copy()
        
        return site_data
    except Exception as e:
        print(f"ERREUR lors du chargement de database.js: {e}")
        import traceback
        traceback.print_exc()
        return None

def load_excel_data():
    """Charge les données depuis le fichier Excel"""
    try:
        df = pd.read_excel('Copie de Descended calculator v1.xlsx', sheet_name='Feuille1', header=None)
        
        # La ligne 6 (index 6) contient les en-têtes avec "Compos" à la colonne 1
        headers_row = 6
        headers = df.iloc[headers_row].values
        
        # "Compos" est à la colonne 1 (index 1)
        compos_col_idx = 1
        
        # Extraire les données
        excel_data = {}
        
        # Parcourir les lignes à partir de la ligne 7 (index 7) jusqu'à la ligne 50 environ
        # (avant les autres sections)
        for idx in range(7, min(51, len(df))):
            row = df.iloc[idx]
            item_name = row.iloc[compos_col_idx]
            
            if pd.isna(item_name):
                continue
            
            item_name = str(item_name).strip()
            
            # Ignorer les lignes spéciales
            if item_name == 'Nombre :' or item_name == 'NaN' or not item_name or item_name.startswith('CRAFT'):
                continue
            
            # Mapper le nom si nécessaire
            mapped_item = ITEM_MAPPING.get(item_name, item_name)
            
            if mapped_item not in excel_data:
                excel_data[mapped_item] = {}
            
            # Parcourir les colonnes de tiers (à partir de compos_col_idx + 1)
            for col_idx in range(compos_col_idx + 1, len(headers)):
                tier_header = headers[col_idx]
                if pd.isna(tier_header):
                    continue
                
                tier_header = str(tier_header).strip()
                mapped_tier = TIER_MAPPING.get(tier_header, tier_header)
                
                value = row.iloc[col_idx]
                if pd.notna(value):
                    try:
                        cost = int(float(value))
                        if cost > 0:
                            excel_data[mapped_item][mapped_tier] = cost
                    except (ValueError, TypeError):
                        pass
        
        return excel_data
    except Exception as e:
        print(f"ERREUR lors du chargement de l'Excel: {e}")
        import traceback
        traceback.print_exc()
        return None

def compare_data(excel_data, site_data):
    """Compare les données Excel avec les données du site"""
    errors = []
    warnings = []
    matches = []
    
    # Vérifier tous les items du site
    for item_name, site_costs in site_data.items():
        if item_name not in excel_data:
            warnings.append(f"AVERTISSEMENT: Item '{item_name}' present dans le site mais absent de l'Excel")
            continue
        
        excel_costs = excel_data[item_name]
        
        # Vérifier chaque tier
        for tier, site_cost in site_costs.items():
            if tier not in excel_costs:
                errors.append(f"ERREUR: {item_name} / {tier}: Site={site_cost}, Excel=ABSENT")
            elif excel_costs[tier] != site_cost:
                errors.append(f"ERREUR: {item_name} / {tier}: Site={site_cost}, Excel={excel_costs[tier]}")
            else:
                matches.append(f"OK: {item_name} / {tier}: {site_cost}")
    
    # Vérifier les items présents dans Excel mais absents du site
    for item_name, excel_costs in excel_data.items():
        if item_name not in site_data:
            warnings.append(f"AVERTISSEMENT: Item '{item_name}' present dans l'Excel mais absent du site")
    
    return errors, warnings, matches

# Main
if __name__ == '__main__':
    print("="*80)
    print("COMPARAISON EXCEL vs SITE")
    print("="*80)
    print()
    
    print("Chargement des donnees du site...")
    site_data = load_site_database()
    if site_data is None:
        print("ERREUR: Impossible de charger les donnees du site")
        sys.exit(1)
    print(f"OK: {len(site_data)} items charges depuis le site")
    print()
    
    print("Chargement des donnees Excel...")
    excel_data = load_excel_data()
    if excel_data is None:
        print("ERREUR: Impossible de charger les donnees Excel")
        sys.exit(1)
    print(f"OK: {len(excel_data)} items charges depuis l'Excel")
    print()
    
    print("Comparaison en cours...")
    errors, warnings, matches = compare_data(excel_data, site_data)
    
    print("="*80)
    print("RESULTATS")
    print("="*80)
    print()
    
    if errors:
        print(f"ERREURS ({len(errors)}):")
        for error in errors[:100]:  # Limiter à 100 pour la lisibilité
            print(f"  {error}")
        if len(errors) > 100:
            print(f"  ... et {len(errors) - 100} erreurs supplementaires")
        print()
    else:
        print("Aucune erreur trouvee!")
        print()
    
    if warnings:
        print(f"AVERTISSEMENTS ({len(warnings)}):")
        for warning in warnings:
            print(f"  {warning}")
        print()
    
    print(f"Correspondances: {len(matches)} valeurs identiques")
    print()
    
    # Résumé
    print("="*80)
    print("RESUME")
    print("="*80)
    print(f"Erreurs: {len(errors)}")
    print(f"Avertissements: {len(warnings)}")
    print(f"Correspondances: {len(matches)}")
    
    if len(errors) == 0:
        print("\nTOUT EST CORRECT! Les donnees Excel correspondent au site.")
    else:
        print(f"\n{len(errors)} differences trouvees entre l'Excel et le site.")
