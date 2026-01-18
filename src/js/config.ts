/**
 * Configuration file for ARK: Primal Descended Calculator
 * Contains tier definitions, column mappings, and application settings
 */

import type { Tier, AppConfig, ExportFormat, CalculatorType } from '../types/index';

// Types de calculateurs disponibles
export const CALCULATOR_TYPES: Record<CalculatorType, { label: string; description: string; icon: string }> = {
  'boss': {
    label: 'Boss Calculator',
    description: 'Calculez les ressources nécessaires pour les boss',
    icon: '👹'
  },
  'key': {
    label: 'Key Calculator',
    description: 'Calculez les ressources nécessaires pour les clés',
    icon: '🗝️'
  },
  'ancient-token': {
    label: 'Ancient Token Calculator',
    description: 'Calculez les ressources nécessaires pour les Ancient Tokens',
    icon: '🪙'
  }
};

// Liste des tiers disponibles dans l'ordre d'affichage
export const TIERS: readonly Tier[] = [
  "T4_Abyssal",
  "T4_Celestial",
  "T5_Nidhogg",
  "T5_Chaos",
  "T5_Order",
  "T6_Normal",
  "T6_Giga",
  "T7_DodoBleu",
  "T7_DodoRouge",
  "T7_WReaper",
  "T7_WGiga",
  "T8_Ascension",
  "T8_Descension",
  "T9_1Seal",
  "T9_2Seal",
  "T9_3Seal",
  "T9_4Seal",
  "T9_Cube"
] as const;

// Configuration des colonnes pour l'affichage des tiers
// Chaque tier est associé à un numéro de colonne (0, 1, ou 2)
export const TIER_COLUMNS: Record<Tier, number> = {
  // Colonne 1: T4, T5, T6
  "T4_Abyssal": 0,
  "T4_Celestial": 0,
  "T5_Nidhogg": 0,
  "T5_Chaos": 0,
  "T5_Order": 0,
  "T6_Normal": 0,
  "T6_Giga": 0,

  // Colonne 2: T7, T8
  "T7_DodoBleu": 1,
  "T7_DodoRouge": 1,
  "T7_WReaper": 1,
  "T7_WGiga": 1,
  "T8_Ascension": 1,
  "T8_Descension": 1,

  // Colonne 3: T9
  "T9_1Seal": 2,
  "T9_2Seal": 2,
  "T9_3Seal": 2,
  "T9_4Seal": 2,
  "T9_Cube": 2
};

// Nombre de colonnes pour l'affichage des tiers
export const NUM_COLUMNS = 3;

// Configuration des labels pour les tiers
// Permet de formater l'affichage des noms de tiers
export const TIER_LABELS: Record<Tier, string> = Object.fromEntries(
  TIERS.map(tier => [tier, tier.replace("_", " ")])
) as Record<Tier, string>;

// Configuration des icônes
export const ICONS_PATH = "/icons-20260117T210540Z-1-001/icons/";

// Configuration de l'application
export const APP_CONFIG: AppConfig = {
  // Valeurs par défaut pour les compteurs
  defaultCount: 0,
  minCount: 0,
  maxCount: 999,

  // localStorage
  storageKey: "calculator_selection",
  autoSaveDelay: 1000, // ms

  // Historique
  maxHistoryItems: 10,

  // Debounce pour les inputs
  inputDebounceDelay: 300, // ms

  // Animations
  toastDuration: 3000, // ms

  // Thème
  defaultTheme: "dark",
  themeStorageKey: "calculator_theme"
};

// Export formats pour les résultats
export const EXPORT_FORMATS: Record<string, ExportFormat> = {
  TEXT: "text",
  MARKDOWN: "markdown",
  CSV: "csv",
  JSON: "json"
};

/**
 * Obtient le numéro de colonne pour un tier donné
 * @param tier - Le nom du tier
 * @returns Le numéro de colonne (0, 1, ou 2)
 */
export function getColumnForTier(tier: string): number {
  return TIER_COLUMNS[tier as Tier] ?? 0;
}

/**
 * Obtient le label formaté pour un tier
 * @param tier - Le nom du tier
 * @returns Le label formaté
 */
export function getTierLabel(tier: string): string {
  return TIER_LABELS[tier as Tier] ?? tier;
}

/**
 * Valide qu'un tier existe dans la configuration
 * @param tier - Le nom du tier à valider
 * @returns True si le tier existe
 */
export function isValidTier(tier: string): tier is Tier {
  return TIERS.includes(tier as Tier);
}

/**
 * Obtient la liste des tiers pour une colonne donnée
 * @param columnIndex - L'index de la colonne (0, 1, ou 2)
 * @returns Liste des tiers dans cette colonne
 */
export function getTiersForColumn(columnIndex: number): Tier[] {
  return TIERS.filter(tier => getColumnForTier(tier) === columnIndex) as Tier[];
}
