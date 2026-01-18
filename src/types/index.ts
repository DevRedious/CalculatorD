/**
 * Types et interfaces pour le calculateur ARK: Primal Descended
 */

export type CalculatorType = 'boss' | 'key' | 'ancient-token';

export type Tier = 
  | "T4_Abyssal"
  | "T4_Celestial"
  | "T5_Nidhogg"
  | "T5_Chaos"
  | "T5_Order"
  | "T6_Normal"
  | "T6_Giga"
  | "T7_DodoBleu"
  | "T7_DodoRouge"
  | "T7_WReaper"
  | "T7_WGiga"
  | "T8_Ascension"
  | "T8_Descension"
  | "T9_1Seal"
  | "T9_2Seal"
  | "T9_3Seal"
  | "T9_4Seal"
  | "T9_Cube";

export interface TierSelection {
  [tier: string]: number;
}

export interface ItemCost {
  [tier: string]: number;
}

export interface DatabaseItem {
  icon: string;
  costs: ItemCost;
}

export interface Database {
  [itemName: string]: DatabaseItem;
}

export interface CalculatedResult {
  item: string;
  quantity: number;
  icon: string;
}

export interface HistoryEntry {
  timestamp: number;
  selection: TierSelection;
  results: Record<string, number>;
}

export interface AppConfig {
  defaultCount: number;
  minCount: number;
  maxCount: number;
  storageKey: string;
  autoSaveDelay: number;
  maxHistoryItems: number;
  inputDebounceDelay: number;
  toastDuration: number;
  defaultTheme: 'dark' | 'light';
  themeStorageKey: string;
}

export type ExportFormat = 'text' | 'markdown' | 'csv' | 'json';

export interface ExportData {
  version: number;
  selection: TierSelection;
  timestamp: number;
}
