/**
 * Calculator class - Core business logic
 * Manages tier selections, calculations, and data persistence
 */

import { TIERS, APP_CONFIG } from './config';
import { DATABASE, getItemCost, getFilteredDatabase } from './database';
import type { TierSelection, CalculatedResult, HistoryEntry, ExportFormat, ExportData, CalculatorType } from '../types/index';

export default class Calculator {
  private selection: TierSelection = {};
  public previousResults: Record<string, number> = {};
  private history: HistoryEntry[] = [];
  private saveTimeout: ReturnType<typeof setTimeout> | null = null;
  private calculatorType: CalculatorType = 'boss';
  
  public onChange: ((tier: string | null, value: number | null) => void) | null = null;
  public onHistoryChange: ((history: HistoryEntry[]) => void) | null = null;

  constructor(calculatorType: CalculatorType = 'boss') {
    this.calculatorType = calculatorType;
    
    // Initialiser la sélection
    this.initSelection();

    // Charger depuis localStorage si disponible
    this.load();
  }

  /**
   * Change le type de calculateur
   * @param type - Le nouveau type de calculateur
   */
  setCalculatorType(type: CalculatorType): void {
    this.calculatorType = type;
    // Réinitialiser les résultats car la database change
    this.previousResults = {};
    if (this.onChange) {
      this.onChange(null, null);
    }
  }

  /**
   * Obtient le type de calculateur actuel
   */
  getCalculatorType(): CalculatorType {
    return this.calculatorType;
  }

  /**
   * Initialise la sélection à 0 pour tous les tiers
   */
  initSelection(): void {
    TIERS.forEach(tier => {
      this.selection[tier] = APP_CONFIG.defaultCount;
    });
  }

  /**
   * Change la quantité d'un tier par un delta
   * @param tier - Le tier à modifier
   * @param delta - Le changement (+1 ou -1)
   */
  changeTier(tier: string, delta: number): void {
    if (!TIERS.includes(tier as any)) {
      console.warn(`Tier invalide: ${tier}`);
      return;
    }

    const currentValue = this.selection[tier] ?? APP_CONFIG.defaultCount;
    const newValue = currentValue + delta;

    this.setTier(tier, newValue);
  }

  /**
   * Définit la quantité d'un tier
   * @param tier - Le tier à modifier
   * @param value - La nouvelle valeur
   * @param silent - Si true, ne déclenche pas onChange
   */
  setTier(tier: string, value: number | string, silent = false): void {
    if (!TIERS.includes(tier as any)) {
      console.warn(`Tier invalide: ${tier}`);
      return;
    }

    // Valider et contraindre la valeur
    let validValue = typeof value === 'string' ? parseInt(value, 10) : value;
    if (isNaN(validValue)) {
      validValue = APP_CONFIG.defaultCount;
    }
    validValue = Math.max(APP_CONFIG.minCount, Math.min(APP_CONFIG.maxCount, validValue));

    // Mettre à jour la sélection
    this.selection[tier] = validValue;

    // Sauvegarder automatiquement (debounced dans UI)
    this.scheduleSave();

    // Notifier le changement
    if (!silent && this.onChange) {
      this.onChange(tier, validValue);
    }
  }

  /**
   * Obtient la quantité d'un tier
   * @param tier - Le tier
   * @returns La quantité
   */
  getTier(tier: string): number {
    return this.selection[tier] ?? APP_CONFIG.defaultCount;
  }

  /**
   * Obtient toutes les sélections de tiers
   * @returns Map des tiers et leurs quantités
   */
  getSelection(): TierSelection {
    return { ...this.selection };
  }

  /**
   * Calcule les ressources nécessaires pour un tier spécifique
   * @param tier - Le tier
   * @returns Map des items et leurs quantités pour ce tier
   */
  calculateForTier(tier: string): Record<string, number> {
    const totals: Record<string, number> = {};
    const qty = this.selection[tier] ?? 0;
    
    if (qty === 0) return totals;
    
    const filteredDatabase = getFilteredDatabase(this.calculatorType);
    
    for (const itemName in filteredDatabase) {
      const cost = getItemCost(itemName, tier);
      if (cost > 0) {
        totals[itemName] = cost * qty;
      }
    }
    
    return totals;
  }

  /**
   * Calcule les totaux de ressources nécessaires
   * @returns Map des items et leurs quantités totales
   */
  calculate(): Record<string, number> {
    const totals: Record<string, number> = {};
    const filteredDatabase = getFilteredDatabase(this.calculatorType);

    // Parcourir tous les tiers sélectionnés
    for (const [tier, qty] of Object.entries(this.selection)) {
      if (qty === 0) continue; // Ignorer les tiers à 0

      // Parcourir uniquement les items filtrés selon le type
      for (const itemName in filteredDatabase) {
        const cost = getItemCost(itemName, tier);
        if (cost > 0) {
          totals[itemName] = (totals[itemName] || 0) + (cost * qty);
        }
      }
    }

    // Sauvegarder pour comparaison future
    this.previousResults = totals;

    return totals;
  }

  /**
   * Calcule les totaux et retourne un tableau trié
   * @returns Tableau trié des résultats
   */
  calculateSorted(): CalculatedResult[] {
    const totals = this.calculate();

    return Object.keys(totals)
      .sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }))
      .map(itemName => ({
        item: itemName,
        quantity: totals[itemName]!,
        icon: DATABASE[itemName]!.icon
      }));
  }

  /**
   * Réinitialise toutes les sélections à 0
   */
  reset(): void {
    TIERS.forEach(tier => {
      this.selection[tier] = APP_CONFIG.defaultCount;
    });

    this.previousResults = {};

    // Sauvegarder
    this.save();

    // Notifier le changement
    if (this.onChange) {
      this.onChange(null, null); // null = reset global
    }
  }

  /**
   * Réinitialise un tier spécifique à 0
   * @param tier - Le tier à réinitialiser
   */
  clearTier(tier: string): void {
    this.setTier(tier, APP_CONFIG.defaultCount);
  }

  /**
   * Exporte la configuration actuelle en JSON
   * @returns Configuration JSON
   */
  export(): string {
    const data: ExportData = {
      version: 1,
      selection: this.selection,
      timestamp: Date.now()
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * Importe une configuration depuis JSON
   * @param jsonString - La configuration JSON
   * @returns true si succès, false si erreur
   */
  import(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString) as ExportData;

      // Valider la structure
      if (!data.selection || typeof data.selection !== 'object') {
        throw new Error('Format invalide');
      }

      // Valider et importer les valeurs
      for (const [tier, value] of Object.entries(data.selection)) {
        if (TIERS.includes(tier as any) && typeof value === 'number') {
          this.setTier(tier, value, true); // silent=true pour éviter multiple onChange
        }
      }

      // Notifier le changement global
      if (this.onChange) {
        this.onChange(null, null);
      }

      // Sauvegarder
      this.save();

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      return false;
    }
  }

  /**
   * Sauvegarde dans localStorage
   */
  save(): void {
    try {
      localStorage.setItem(APP_CONFIG.storageKey, this.export());
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  }

  /**
   * Planifie une sauvegarde (pour debouncing)
   */
  scheduleSave(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    this.saveTimeout = setTimeout(() => {
      this.save();
    }, APP_CONFIG.autoSaveDelay);
  }

  /**
   * Charge depuis localStorage
   * @returns true si des données ont été chargées
   */
  load(): boolean {
    try {
      const saved = localStorage.getItem(APP_CONFIG.storageKey);
      if (saved) {
        return this.import(saved);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    }
    return false;
  }

  /**
   * Ajoute la configuration actuelle à l'historique
   */
  addToHistory(): void {
    const entry: HistoryEntry = {
      timestamp: Date.now(),
      selection: { ...this.selection },
      results: this.calculate()
    };

    this.history.unshift(entry);

    // Limiter la taille de l'historique
    if (this.history.length > APP_CONFIG.maxHistoryItems) {
      this.history.pop();
    }

    // Notifier
    if (this.onHistoryChange) {
      this.onHistoryChange(this.history);
    }
  }

  /**
   * Restaure une configuration depuis l'historique
   * @param index - L'index dans l'historique
   * @returns true si succès
   */
  restoreFromHistory(index: number): boolean {
    if (index < 0 || index >= this.history.length) {
      return false;
    }

    const entry = this.history[index]!;

    // Restaurer la sélection
    for (const [tier, value] of Object.entries(entry.selection)) {
      this.setTier(tier, value, true); // silent=true
    }

    // Notifier le changement global
    if (this.onChange) {
      this.onChange(null, null);
    }

    return true;
  }

  /**
   * Obtient l'historique
   * @returns L'historique des calculs
   */
  getHistory(): HistoryEntry[] {
    return this.history;
  }

  /**
   * Efface l'historique
   */
  clearHistory(): void {
    this.history = [];
    if (this.onHistoryChange) {
      this.onHistoryChange(this.history);
    }
  }

  /**
   * Exporte les résultats dans différents formats
   * @param format - Le format (text, markdown, csv, json)
   * @returns Les résultats formatés
   */
  exportResults(format: ExportFormat = 'text'): string {
    const results = this.calculateSorted();

    switch (format) {
      case 'text':
        return this.exportAsText(results);
      case 'markdown':
        return this.exportAsMarkdown(results);
      case 'csv':
        return this.exportAsCSV(results);
      case 'json':
        return JSON.stringify(results, null, 2);
      default:
        return this.exportAsText(results);
    }
  }

  /**
   * Exporte en format texte
   */
  private exportAsText(results: CalculatedResult[]): string {
    let text = 'Résultats du Calculateur ARK: Primal Descended\n';
    text += '='.repeat(50) + '\n\n';

    for (const { item, quantity } of results) {
      text += `${item}: ${quantity}\n`;
    }

    return text;
  }

  /**
   * Exporte en format Markdown
   */
  private exportAsMarkdown(results: CalculatedResult[]): string {
    let md = '# Résultats du Calculateur ARK: Primal Descended\n\n';
    md += '| Item | Quantité |\n';
    md += '|------|----------|\n';

    for (const { item, quantity } of results) {
      md += `| ${item} | ${quantity} |\n`;
    }

    return md;
  }

  /**
   * Exporte en format CSV
   */
  private exportAsCSV(results: CalculatedResult[]): string {
    let csv = 'Item,Quantité\n';

    for (const { item, quantity } of results) {
      csv += `"${item}",${quantity}\n`;
    }

    return csv;
  }

  /**
   * Vérifie si des changements ont été effectués
   * @returns true si des tiers sont > 0
   */
  hasChanges(): boolean {
    return Object.values(this.selection).some(value => value > 0);
  }

  /**
   * Obtient un résumé de la sélection actuelle
   * @returns Résumé avec nombre de tiers sélectionnés et total
   */
  getSummary() {
    const selectedTiers = Object.entries(this.selection)
      .filter(([_, qty]) => qty > 0);

    const totalQuantity = selectedTiers.reduce((sum, [_, qty]) => sum + qty, 0);
    const totalItems = Object.keys(this.calculate()).length;

    return {
      tiersSelected: selectedTiers.length,
      totalQuantity,
      totalItemTypes: totalItems
    };
  }
}
