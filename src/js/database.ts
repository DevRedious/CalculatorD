/**
 * Database of all items and their costs per tier
 * ARK: Primal Descended Calculator
 */

import { ICONS_PATH } from './config';
import type { Database, Tier, CalculatorType } from '../types/index';

// Base de données des items avec leurs coûts par tier
export const DATABASE: Database = {
  "Artefact": {
    icon: `${ICONS_PATH}artefact.png`,
    costs: {
      "T4_Abyssal": 2,
      "T4_Celestial": 2,
      "T5_Nidhogg": 4,
      "T5_Chaos": 3,
      "T5_Order": 3,
      "T6_Normal": 3,
      "T6_Giga": 3,
      "T7_DodoBleu": 3,
      "T7_DodoRouge": 3,
      "T7_WReaper": 3,
      "T7_WGiga": 3,
      "T8_Ascension": 5,
      "T8_Descension": 5,
      "T9_1Seal": 3,
      "T9_2Seal": 5,
      "T9_3Seal": 5,
      "T9_4Seal": 5,
      "T9_Cube": 3
    }
  },
  "Abyssal Warfare Key": {
    icon: `${ICONS_PATH}abyssal_key.png`,
    costs: {
      "T5_Nidhogg": 1,
      "T5_Chaos": 1,
      "T5_Order": 1,
      "T8_Ascension": 1,
      "T8_Descension": 1,
      "T9_1Seal": 1,
      "T9_2Seal": 1,
      "T9_3Seal": 1,
      "T9_4Seal": 1,
      "T9_Cube": 1
    }
  },
  "Celestial Warfare Key": { // Fixed capitalization
    icon: `${ICONS_PATH}celestial_key.png`,
    costs: {
      "T5_Nidhogg": 1,
      "T5_Chaos": 1,
      "T5_Order": 1,
      "T8_Ascension": 1,
      "T8_Descension": 1,
      "T9_1Seal": 1,
      "T9_2Seal": 1,
      "T9_3Seal": 1,
      "T9_4Seal": 1,
      "T9_Cube": 1
    }
  },
  "Ancient Token Cluster": { // Fixed capitalization
    icon: `${ICONS_PATH}ancient_token.png`,
    costs: {
      "T4_Abyssal": 1,
      "T4_Celestial": 1,
      "T5_Nidhogg": 3,
      "T5_Chaos": 1,
      "T5_Order": 1,
      "T6_Normal": 2,
      "T6_Giga": 3,
      "T7_DodoBleu": 2,
      "T7_DodoRouge": 2,
      "T7_WReaper": 2,
      "T7_WGiga": 2,
      "T8_Ascension": 3,
      "T8_Descension": 3,
      "T9_1Seal": 5,
      "T9_2Seal": 6,
      "T9_3Seal": 6,
      "T9_4Seal": 6,
      "T9_Cube": 3
    }
  },
  "Combat Essence": {
    icon: `${ICONS_PATH}combat_essence.png`,
    costs: {
      "T4_Abyssal": 10,
      "T4_Celestial": 10,
      "T5_Nidhogg": 10,
      "T5_Chaos": 10,
      "T5_Order": 10,
      "T7_DodoBleu": 10,
      "T7_DodoRouge": 10
    }
  },
  "Devilish Soul": {
    icon: `${ICONS_PATH}devilish_soul.png`,
    costs: {
      "T4_Abyssal": 12,
      "T5_Nidhogg": 24,
      "T5_Chaos": 10,
      "T5_Order": 10,
      "T6_Normal": 10,
      "T6_Giga": 15,
      "T7_DodoBleu": 10,
      "T7_DodoRouge": 10,
      "T7_WReaper": 15,
      "T7_WGiga": 15,
      "T8_Ascension": 40,
      "T8_Descension": 40,
      "T9_1Seal": 35,
      "T9_2Seal": 40,
      "T9_3Seal": 40,
      "T9_4Seal": 60,
      "T9_Cube": 40
    }
  },
  "Divine Soul": {
    icon: `${ICONS_PATH}divine_soul.png`,
    costs: {
      "T4_Celestial": 12,
      "T5_Nidhogg": 24,
      "T5_Chaos": 10,
      "T5_Order": 10,
      "T6_Normal": 10,
      "T6_Giga": 15,
      "T7_DodoBleu": 10,
      "T7_DodoRouge": 10,
      "T7_WReaper": 15,
      "T7_WGiga": 15,
      "T8_Ascension": 40,
      "T8_Descension": 40,
      "T9_1Seal": 35,
      "T9_2Seal": 40,
      "T9_3Seal": 40,
      "T9_4Seal": 60,
      "T9_Cube": 40
    }
  },
  "Devilish Hide": {
    icon: `${ICONS_PATH}devilish_hide.png`,
    costs: {
      "T4_Abyssal": 500,
      "T5_Nidhogg": 3000,
      "T5_Chaos": 1000,
      "T5_Order": 1000,
      "T6_Normal": 1000,
      "T6_Giga": 2000,
      "T7_DodoBleu": 1000,
      "T7_DodoRouge": 1000,
      "T7_WReaper": 1000,
      "T7_WGiga": 1000,
      "T9_Cube": 5000
    }
  },
  "Divine Hide": {
    icon: `${ICONS_PATH}divine_hide.png`,
    costs: {
      "T4_Celestial": 500,
      "T5_Nidhogg": 3000,
      "T5_Chaos": 1000,
      "T5_Order": 1000,
      "T6_Normal": 1000,
      "T6_Giga": 2000,
      "T7_DodoBleu": 1000,
      "T7_DodoRouge": 1000,
      "T7_WReaper": 1000,
      "T7_WGiga": 1000,
      "T9_Cube": 5000
    }
  },
  "Excellent Soul": {
    icon: `${ICONS_PATH}excellent_soul.png`,
    costs: {
      "T4_Abyssal": 20,
      "T4_Celestial": 20,
      "T5_Nidhogg": 30,
      "T5_Chaos": 25,
      "T5_Order": 25,
      "T6_Normal": 25,
      "T6_Giga": 30,
      "T7_DodoBleu": 20,
      "T7_DodoRouge": 20,
      "T7_WReaper": 30,
      "T7_WGiga": 30,
      "T8_Ascension": 60,
      "T8_Descension": 60,
      "T9_Cube": 60
    }
  },
  "Unreal Essence": {
    icon: `${ICONS_PATH}unreal_essence.png`,
    costs: {
      "T4_Abyssal": 50,
      "T4_Celestial": 50,
      "T5_Nidhogg": 1000,
      "T5_Chaos": 100,
      "T5_Order": 100
    }
  },
  "Black Pearl": {
    icon: `${ICONS_PATH}black_pearl.png`,
    costs: {
      "T4_Abyssal": 500,
      "T4_Celestial": 500,
      "T5_Nidhogg": 1500,
      "T5_Chaos": 1000,
      "T5_Order": 1000,
      "T6_Normal": 1000,
      "T6_Giga": 1500,
      "T7_DodoBleu": 800,
      "T7_DodoRouge": 800,
      "T7_WReaper": 1000,
      "T7_WGiga": 1000,
      "T8_Ascension": 2000,
      "T8_Descension": 2000,
      "T9_1Seal": 1000,
      "T9_2Seal": 1500,
      "T9_3Seal": 1500,
      "T9_4Seal": 1500,
      "T9_Cube": 2000
    }
  },
  "Devilish Essence": {
    icon: `${ICONS_PATH}devilish_essence.png`,
    costs: {
      "T4_Abyssal": 1
    }
  },
  "Divine Essence": {
    icon: `${ICONS_PATH}divine_essence.png`,
    costs: {
      "T4_Celestial": 1
    }
  },
  "Abyssal Energy": {
    icon: `${ICONS_PATH}abyssal_energy.png`,
    costs: {
      "T4_Abyssal": 10
    }
  },
  "Celestial Energy": {
    icon: `${ICONS_PATH}celestial_energy.png`,
    costs: {
      "T4_Celestial": 10
    }
  },
  "Chaos Warchief Soul": {
    icon: `${ICONS_PATH}chaos_warchief_soul.png`,
    costs: {
      "T6_Normal": 2,
      "T6_Giga": 2
    }
  },
  "Order Warchief Soul": {
    icon: `${ICONS_PATH}order_warchief_soul.png`,
    costs: {
      "T6_Normal": 2,
      "T6_Giga": 2
    }
  },
  "Bionic Essence": {
    icon: `${ICONS_PATH}bionic_essence.png`,
    costs: {
      "T6_Giga": 500
    }
  },
  "Bionic Soul": {
    icon: `${ICONS_PATH}bionic_soul.png`,
    costs: {
      "T7_DodoBleu": 5,
      "T7_DodoRouge": 5,
      "T7_WReaper": 6,
      "T7_WGiga": 6
    }
  },
  "Descended Ingot": {
    icon: `${ICONS_PATH}descended_ingot.png`,
    costs: {
      "T7_DodoBleu": 400,
      "T7_DodoRouge": 400,
      "T7_WReaper": 800,
      "T7_WGiga": 800,
      "T9_1Seal": 500,
      "T9_2Seal": 450,
      "T9_3Seal": 450,
      "T9_4Seal": 600
    }
  },
  "Ascended Warden Essence": {
    icon: `${ICONS_PATH}ascended_warden_essence.png`,
    costs: {
      "T7_WGiga": 5,
      "T8_Ascension": 10,
      "T9_Cube": 8
    }
  },
  "Descended Warden Essence": {
    icon: `${ICONS_PATH}descended_warden_essence.png`,
    costs: {
      "T7_WReaper": 5,
      "T8_Descension": 10,
      "T9_Cube": 8
    }
  },
  "Luminous Essence": {
    icon: `${ICONS_PATH}luminous_essence.png`,
    costs: {
      "T7_WReaper": 200
    }
  },
  "Ancient Essence": {
    icon: `${ICONS_PATH}ancient_essence.png`,
    costs: {
      "T7_WGiga": 1000
    }
  },
  "Bionic Giga Essence": {
    icon: `${ICONS_PATH}bionic_giga_essence.png`,
    costs: {
      "T8_Ascension": 1,
      "T8_Descension": 1
    }
  },
  "Descended Essence": {
    icon: `${ICONS_PATH}descended_essence.png`,
    costs: {
      "T7_WReaper": 1000,
      "T7_WGiga": 1000,
      "T8_Ascension": 2500,
      "T8_Descension": 2500,
      "T9_1Seal": 2000,
      "T9_2Seal": 3000,
      "T9_3Seal": 3000,
      "T9_4Seal": 3000
    }
  },
  "Excellent Essence": {
    icon: `${ICONS_PATH}excellent_essence.png`,
    costs: {
      "T8_Ascension": 2000,
      "T8_Descension": 2000
    }
  },
  "Warden Rex Trophy": {
    icon: `${ICONS_PATH}warden_rex_trophy.png`,
    costs: {
      "T8_Ascension": 5,
      "T8_Descension": 5
    }
  },
  "Warden Spino Trophy": {
    icon: `${ICONS_PATH}warden_spino_trophy.png`,
    costs: {
      "T8_Ascension": 5,
      "T8_Descension": 5
    }
  },
  "Warden Lizard Trophy": {
    icon: `${ICONS_PATH}warden_lizard_trophy.png`,
    costs: {
      "T8_Ascension": 5,
      "T8_Descension": 5
    }
  },
  "Warden Theri Trophy": {
    icon: `${ICONS_PATH}warden_theri_trophy.png`,
    costs: {
      "T8_Ascension": 5,
      "T8_Descension": 5
    }
  },
  "Supreme Warden Giga Trophy": {
    icon: `${ICONS_PATH}supreme_warden_giga_trophy.png`,
    costs: {
      "T8_Ascension": 1,
      "T8_Descension": 1,
      "T9_Cube": 1
    }
  },
  "Supreme Warden Reaper Trophy": {
    icon: `${ICONS_PATH}supreme_warden_reaper_trophy.png`,
    costs: {
      "T8_Ascension": 1,
      "T8_Descension": 1,
      "T9_Cube": 1
    }
  },
  "Soul of Ascension God": {
    icon: `${ICONS_PATH}soul_ascension_god.png`,
    costs: {
      "T9_1Seal": 1,
      "T9_2Seal": 1,
      "T9_3Seal": 1,
      "T9_4Seal": 1,
      "T9_Cube": 1
    }
  },
  "Soul of Descension God": {
    icon: `${ICONS_PATH}soul_descension_god.png`,
    costs: {
      "T9_1Seal": 1,
      "T9_2Seal": 1,
      "T9_3Seal": 1,
      "T9_4Seal": 1,
      "T9_Cube": 1
    }
  },
  "Seal Fragments": {
    icon: `${ICONS_PATH}seal_fragment.png`,
    costs: {
      "T9_Cube": 2
    }
  }
};

/**
 * Valide la structure de la base de données
 * @returns Liste des erreurs trouvées
 */
export async function validateDatabase(): Promise<string[]> {
  const errors: string[] = [];
  const { TIERS } = await import('./config.js');

  for (const [itemName, item] of Object.entries(DATABASE)) {
    // Vérifier présence de l'icône
    if (!item.icon) {
      errors.push(`${itemName}: icon manquante`);
    }

    // Vérifier les coûts
    if (!item.costs || typeof item.costs !== 'object') {
      errors.push(`${itemName}: costs invalides ou manquants`);
      continue;
    }

    // Vérifier que les coûts sont des nombres
    for (const [tier, cost] of Object.entries(item.costs)) {
      if (typeof cost !== 'number' || cost < 0) {
        errors.push(`${itemName}: coût invalide pour ${tier} (${cost})`);
      }

      // Vérifier que le tier existe dans la config
      if (!TIERS.includes(tier as Tier)) {
        errors.push(`${itemName}: tier inconnu "${tier}"`);
      }
    }
  }

  return errors;
}

/**
 * Obtient tous les items triés alphabétiquement
 * @returns Liste des noms d'items
 */
export function getItemNames(): string[] {
  return Object.keys(DATABASE).sort((a, b) =>
    a.localeCompare(b, 'fr', { sensitivity: 'base' })
  );
}

/**
 * Obtient le coût d'un item pour un tier spécifique
 * @param itemName - Le nom de l'item
 * @param tier - Le tier
 * @returns Le coût (0 si non défini)
 */
export function getItemCost(itemName: string, tier: string): number {
  const item = DATABASE[itemName];
  if (!item || !item.costs) return 0;
  return item.costs[tier] ?? 0;
}

/**
 * Obtient l'icône d'un item
 * @param itemName - Le nom de l'item
 * @returns Le chemin de l'icône
 */
export function getItemIcon(itemName: string): string {
  const item = DATABASE[itemName];
  return item?.icon ?? '';
}

/**
 * Vérifie si un item a un coût pour au moins un tier
 * @param itemName - Le nom de l'item
 * @returns True si l'item a au moins un coût
 */
export function hasAnyCost(itemName: string): boolean {
  const item = DATABASE[itemName];
  if (!item || !item.costs) return false;
  return Object.keys(item.costs).length > 0;
}

/**
 * Filtre les items selon le type de calculateur
 * @param calculatorType - Le type de calculateur
 * @returns Database filtrée selon le type
 */
export function getFilteredDatabase(calculatorType: CalculatorType): Database {
  const filtered: Database = {};
  
  for (const [itemName, item] of Object.entries(DATABASE)) {
    let include = false;
    
    switch (calculatorType) {
      case 'boss':
        // Exclure les Keys et Ancient Token
        include = !itemName.toLowerCase().includes('key') && 
                  !itemName.toLowerCase().includes('ancient token');
        break;
      case 'key':
        // Inclure uniquement les Keys
        include = itemName.toLowerCase().includes('key');
        break;
      case 'ancient-token':
        // Inclure uniquement Ancient Token Cluster
        include = itemName.toLowerCase().includes('ancient token');
        break;
    }
    
    if (include) {
      filtered[itemName] = item;
    }
  }
  
  return filtered;
}
