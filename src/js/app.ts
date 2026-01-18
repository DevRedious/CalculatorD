/**
 * App.ts - Application entry point
 * Initializes the calculator and UI, sets up advanced features
 */

import Calculator from './calculator';
import UI from './ui';
import { APP_CONFIG, CALCULATOR_TYPES } from './config';
import type { CalculatorType } from '../types/index';
import { ThemeSwitch, type ThemeMode } from './theme-switch';

/**
 * Theme Manager - Gère le thème avec ThemeSwitch (light/dark/system)
 */

class ThemeManager {
  private themeSwitch: ThemeSwitch | null = null;

  constructor() {
    this.init();
  }

  init(): void {
    try {
      this.themeSwitch = new ThemeSwitch('themeToggleContainer', (mode: ThemeMode) => {
        console.log(`Theme changé vers: ${mode}`);
      });
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du ThemeSwitch:', error);
    }
  }

  getTheme(): 'light' | 'dark' {
    return this.themeSwitch?.getEffectiveTheme() || APP_CONFIG.defaultTheme;
  }

  getMode(): ThemeMode {
    return this.themeSwitch?.getMode() || APP_CONFIG.defaultTheme;
  }
}

/**
 * Feature Manager - Gère les fonctionnalités avancées
 */
class FeatureManager {
  private calculator: Calculator;
  private ui: UI;

  constructor(calculator: Calculator, ui: UI) {
    this.calculator = calculator;
    this.ui = ui;
    this.setupFeatures();
  }

  setupFeatures(): void {
    // Export
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', (e: Event) => {
        e.preventDefault();
        this.handleExport();
      });
    }

    // Import
    const importBtn = document.getElementById('importBtn');
    if (importBtn) {
      importBtn.addEventListener('click', (e: Event) => {
        e.preventDefault();
        this.handleImport();
      });
    }

    // Copy Results
    const copyResultsBtn = document.getElementById('copyResultsBtn');
    if (copyResultsBtn) {
      copyResultsBtn.addEventListener('click', (e: Event) => {
        e.preventDefault();
        this.handleCopyResults();
      });
    }

    // Keyboard shortcuts
    this.setupKeyboardShortcuts();
  }

  /**
   * Gère l'export de la configuration
   */
  handleExport(): void {
    const config = this.calculator.export();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `ark-calculator-${timestamp}.json`;

    this.ui.downloadFile(config, filename, 'application/json');
    this.ui.showToast('Configuration exportée avec succès!');
  }

  /**
   * Gère l'import de la configuration
   */
  async handleImport(): Promise<void> {
    // Créer un input file temporaire
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.addEventListener('change', async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const success = this.calculator.import(text);

        if (success) {
          this.ui.refreshCounters();
          this.ui.showToast('Configuration importée avec succès!');
        } else {
          this.ui.showToast('Erreur: fichier invalide');
        }
      } catch (error) {
        console.error('Erreur lors de l\'import:', error);
        this.ui.showToast('Erreur lors de l\'import');
      }
    });

    input.click();
  }

  /**
   * Copie les résultats dans le presse-papier
   */
  async handleCopyResults(): Promise<void> {
    if (!this.calculator.hasChanges()) {
      this.ui.showToast('Aucun résultat à copier');
      return;
    }

    const results = this.calculator.exportResults('text');
    const success = await this.ui.copyToClipboard(results);

    if (success) {
      this.ui.showToast('Résultats copiés dans le presse-papier!');
    } else {
      this.ui.showToast('Erreur lors de la copie');
    }
  }

  /**
   * Configure les raccourcis clavier
   */
  setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      // Ctrl/Cmd + E: Export
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        this.handleExport();
      }

      // Ctrl/Cmd + I: Import
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        this.handleImport();
      }

      // Ctrl/Cmd + Shift + C: Copy Results
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        this.handleCopyResults();
      }

      // Ctrl/Cmd + R: Reset
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        this.calculator.reset();
        this.ui.showToast('Tous les compteurs ont été réinitialisés');
      }
    });
  }
}

/**
 * Application principale
 */
class App {
  private calculator: Calculator | null = null;
  private ui: UI | null = null;
  private themeManager: ThemeManager | null = null;
  private currentCalculatorType: CalculatorType = 'boss';

  /**
   * Initialise l'application
   */
  async init(): Promise<void> {
    console.log('🚀 Initialisation du calculateur ARK: Primal Descended...');

    try {
      // Déterminer le type de calculateur depuis l'URL ou localStorage
      const urlParams = new URLSearchParams(window.location.search);
      const typeFromUrl = urlParams.get('type') as CalculatorType;
      const savedType = localStorage.getItem('calculator_type') as CalculatorType;
      this.currentCalculatorType = typeFromUrl || savedType || 'boss';
      
      // Créer le calculator avec le type
      this.calculator = new Calculator(this.currentCalculatorType);
      console.log(`✅ Calculator initialisé (type: ${this.currentCalculatorType})`);

      // Créer l'UI
      this.ui = new UI(this.calculator);
      console.log('✅ UI initialisée');

      // Initialiser le theme manager
      this.themeManager = new ThemeManager();
      console.log('✅ Theme manager initialisé');

      // Initialiser le feature manager
      new FeatureManager(this.calculator, this.ui);
      console.log('✅ Feature manager initialisé');

      // Initialiser le modal de remerciements
      this.setupThanksModal();
      console.log('✅ Modal de remerciements initialisé');

      // Initialiser la navigation des types de calculateurs
      this.setupCalculatorTypeNavigation();
      this.updatePageTitle(); // Mettre à jour le titre au chargement
      console.log('✅ Navigation des types de calculateurs initialisée');

      // Message de bienvenue
      const hasData = this.calculator.hasChanges();
      if (hasData) {
        this.ui.showToast('Configuration restaurée depuis la sauvegarde');
      } else {
        this.ui.showToast('Bienvenue sur le calculateur ARK!');
      }

      console.log('✨ Application prête!');

      // Exposer pour le debugging (en développement uniquement)
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        (window as any).arkApp = {
          calculator: this.calculator,
          ui: this.ui,
          themeManager: this.themeManager
        };
        console.log('🔧 Mode développement: arkApp exposé dans window');
      }

    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation:', error);
      alert('Erreur lors du chargement de l\'application. Veuillez rafraîchir la page.');
    }
  }

  /**
   * Configure le modal de remerciements
   */
  setupThanksModal(): void {
    const thanksBtn = document.getElementById('thanksBtn');
    const thanksModal = document.getElementById('thanksModal');
    const modalClose = thanksModal?.querySelector('.modal-close');
    const modalOverlay = thanksModal?.querySelector('.modal-overlay');

    if (!thanksBtn || !thanksModal) return;

    // Ouvrir le modal
    thanksBtn.addEventListener('click', () => {
      thanksModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      // Focus sur le bouton de fermeture pour l'accessibilité
      (modalClose as HTMLElement)?.focus();
    });

    // Fermer le modal
    const closeModal = () => {
      thanksModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      thanksBtn.focus();
    };

    modalClose?.addEventListener('click', closeModal);
    modalOverlay?.addEventListener('click', closeModal);

    // Fermer avec la touche Escape
    thanksModal.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && thanksModal.getAttribute('aria-hidden') === 'false') {
        closeModal();
      }
    });
  }

  /**
   * Configure la navigation des types de calculateurs
   */
  setupCalculatorTypeNavigation(): void {
    const buttons = document.querySelectorAll('.calc-type-btn');
    const pageTitle = document.querySelector('.page-title h1');
    const pageDescription = document.querySelector('.page-title p');
    
    // Mettre à jour l'état actif du bouton
    buttons.forEach(btn => {
      const type = btn.getAttribute('data-type') as CalculatorType;
      if (type === this.currentCalculatorType) {
        btn.classList.add('active');
      }
      
      btn.addEventListener('click', () => {
        this.switchCalculatorType(type);
        // Fermer le menu mobile après sélection
        this.closeMobileMenu();
      });
    });
    
    // Configurer le menu hamburger mobile
    this.setupMobileMenu();
    
    // Mettre à jour le titre et la description
    this.updatePageTitle();
  }

  /**
   * Configure le menu hamburger mobile
   */
  setupMobileMenu(): void {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!mobileMenuBtn || !mobileMenu) return;
    
    // Toggle du menu au clic sur le bouton hamburger
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMobileMenu();
    });
    
    // Fermer le menu au clic en dehors
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!mobileMenu.contains(target) && !mobileMenuBtn.contains(target)) {
        this.closeMobileMenu();
      }
    });
    
    // Fermer le menu avec la touche Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.getAttribute('aria-hidden') === 'false') {
        this.closeMobileMenu();
      }
    });
  }

  /**
   * Ouvre ou ferme le menu mobile
   */
  toggleMobileMenu(): void {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!mobileMenuBtn || !mobileMenu) return;
    
    const isOpen = mobileMenu.getAttribute('aria-hidden') === 'false';
    
    if (isOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  /**
   * Ouvre le menu mobile
   */
  openMobileMenu(): void {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!mobileMenuBtn || !mobileMenu) return;
    
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    mobileMenuBtn.setAttribute('aria-label', 'Fermer le menu');
  }

  /**
   * Ferme le menu mobile
   */
  closeMobileMenu(): void {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!mobileMenuBtn || !mobileMenu) return;
    
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileMenuBtn.setAttribute('aria-label', 'Ouvrir le menu');
  }

  /**
   * Change le type de calculateur
   * @param type - Le nouveau type de calculateur
   */
  switchCalculatorType(type: CalculatorType): void {
    if (type === this.currentCalculatorType) return;
    
    this.currentCalculatorType = type;
    localStorage.setItem('calculator_type', type);
    
    // Mettre à jour le calculator
    if (this.calculator) {
      this.calculator.setCalculatorType(type);
    }
    
    // Mettre à jour l'UI
    this.updateActiveButton(type);
    this.updatePageTitle();
    
    // Mettre à jour l'affichage des tiers selon le type
    if (this.ui) {
      this.updateTiersDisplay(type);
      this.ui.updateResults();
    }
    
    // Mettre à jour l'URL sans recharger la page
    const url = new URL(window.location.href);
    url.searchParams.set('type', type);
    window.history.pushState({ type }, '', url.toString());
  }

  /**
   * Met à jour l'affichage des tiers selon le type de calculateur
   * @param type - Le type de calculateur
   */
  updateTiersDisplay(type: CalculatorType): void {
    if (!this.ui) return;
    
    const tiersContainer = document.getElementById('tiers');
    if (!tiersContainer) return;
    
    if (type === 'boss') {
      // Afficher les tiers pour le type boss
      this.ui.createTiersUI();
    } else if (type === 'key') {
      // Afficher l'interface des clés
      this.ui.createKeysUI();
    } else if (type === 'ancient-token') {
      // Afficher l'interface des tokens
      this.ui.createTokenUI();
    } else {
      // Afficher l'état vide pour les autres types
      this.ui.showEmptyState();
    }
  }

  /**
   * Met à jour le bouton actif
   * @param activeType - Le type actif
   */
  updateActiveButton(activeType: CalculatorType): void {
    const buttons = document.querySelectorAll('.calc-type-btn');
    buttons.forEach(btn => {
      const type = btn.getAttribute('data-type') as CalculatorType;
      if (type === activeType) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  /**
   * Met à jour le titre et la description de la page
   */
  updatePageTitle(): void {
    const pageTitle = document.querySelector('.page-title h1');
    const pageDescription = document.querySelector('.page-title p');
    const config = CALCULATOR_TYPES[this.currentCalculatorType];
    
    if (pageTitle) {
      pageTitle.textContent = config.label;
    }
    if (pageDescription) {
      pageDescription.textContent = config.description;
    }
  }

  /**
   * Cleanup avant fermeture (optionnel)
   */
  cleanup(): void {
    // Sauvegarder une dernière fois
    if (this.calculator) {
      this.calculator.save();
    }
  }
}

/**
 * Point d'entrée - Attendre que le DOM soit chargé
 */
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();

  // Sauvegarder avant fermeture
  window.addEventListener('beforeunload', () => {
    app.cleanup();
  });
});

// Gestion des erreurs globales
window.addEventListener('error', (event: ErrorEvent) => {
  console.error('Erreur globale:', event.error);
});

window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
  console.error('Promise rejetée:', event.reason);
});
