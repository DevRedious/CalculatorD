/**
 * UI class - Interface management
 * Handles DOM manipulation, event listeners, and user interactions
 * FIXES: Memory leak from duplicate event listeners
 */

import { TIERS, getTierLabel, APP_CONFIG, ICONS_PATH } from './config';
import Calculator from './calculator';
import type { ExportFormat, TierSelection } from '../types/index';
import { calculateAbyssalKeyResources, calculateCelestialKeyResources, calculateGodKeyResources, combineResources } from './key-database';
import { calculateTokenResources, calculateTokenItemResources, combineTokenResources, TOKEN_ICONS } from './token-database';
import { DATABASE } from './database';

export default class UI {
  private calculator: Calculator;
  private tiersContainer: HTMLElement | null;
  private resultsContainer: HTMLElement | null;
  private resetBtn: HTMLElement | null;
  private tierInputs: Record<string, HTMLInputElement> = {};
  private keyInputs: {
    abyssal: HTMLInputElement | null;
    celestial: HTMLInputElement | null;
    god: HTMLInputElement | null;
  } = {
    abyssal: null,
    celestial: null,
    god: null
  };
  private tokenInput: HTMLInputElement | null = null;
  private ancientDinoInput: HTMLInputElement | null = null;
  private inputTimeout: ReturnType<typeof setTimeout> | null = null;
  private toastTimeout: ReturnType<typeof setTimeout> | null = null;

  /**
   * Crée l'interface des tiers (style grille de cartes)
   * Méthode publique pour permettre la recréation depuis l'extérieur
   */
  createTiersUI(): void {
    if (!this.tiersContainer) return;
    
    // Vider le conteneur avant de recréer
    this.tiersContainer.innerHTML = '';
    
    // Retirer la classe spécifique aux clés si elle existe
    // et s'assurer que le conteneur revient à son état initial
    this.tiersContainer.classList.remove('tiers-container-keys');
    
    // S'assurer que le conteneur utilise bien la classe tiers-grid
    if (!this.tiersContainer.classList.contains('tiers-grid')) {
      this.tiersContainer.classList.add('tiers-grid');
    }
    
    // Créer chaque tier comme une carte
    TIERS.forEach(tier => {
      const tierCard = this.createTierElement(tier);
      this.tiersContainer!.appendChild(tierCard);
    });
    
    // Forcer un reflow et un recalcul des styles après un court délai
    // pour s'assurer que les styles sont bien appliqués
    requestAnimationFrame(() => {
      if (this.tiersContainer) {
        this.tiersContainer.offsetHeight;
        // Forcer le recalcul des styles en modifiant temporairement une propriété
        const originalDisplay = this.tiersContainer.style.display;
        this.tiersContainer.style.display = 'none';
        requestAnimationFrame(() => {
          if (this.tiersContainer) {
            this.tiersContainer.style.display = originalDisplay || '';
          }
        });
      }
    });
  }

  constructor(calculator: Calculator) {
    this.calculator = calculator;

    // Éléments DOM
    this.tiersContainer = document.getElementById('tiers');
    this.resultsContainer = document.getElementById('results');
    this.resetBtn = document.getElementById('resetBtn');

    // Initialiser l'interface
    this.init();
  }

  /**
   * Initialise l'interface utilisateur
   */
  init(): void {
    if (!this.tiersContainer || !this.resultsContainer) {
      console.error('Éléments DOM manquants');
      return;
    }

    // Créer l'UI selon le type de calculateur
    const calculatorType = this.calculator.getCalculatorType();
    if (calculatorType === 'boss') {
      this.createTiersUI();
    } else if (calculatorType === 'key') {
      this.createKeysUI();
    } else if (calculatorType === 'ancient-token') {
      this.createTokenUI();
    } else {
      // Pour les autres types, afficher un message
      this.showEmptyState();
    }

    // Configurer les event listeners (UNE SEULE FOIS - FIX DU BUG)
    this.setupEventListeners();

    // Lier le calculator aux callbacks
    this.calculator.onChange = this.onCalculatorChange.bind(this);

    // Afficher les résultats initiaux
    this.updateResults();
  }

  /**
   * Crée l'interface des clés (même style visuel que les tiers)
   */
  createKeysUI(): void {
    if (!this.tiersContainer) return;
    
    // Vider le conteneur avant de recréer
    this.tiersContainer.innerHTML = '';
    
    // Retirer tiers-grid et ajouter la classe pour le style spécifique des clés
    this.tiersContainer.classList.remove('tiers-grid');
    this.tiersContainer.classList.add('tiers-container-keys');
    
    // Créer les 3 cartes de clés
    const abyssalCard = this.createKeyElement('abyssal', 'Abyssal Warfare Key', 'CRAFT NORMAL', 'abyssal_key.png');
    const celestialCard = this.createKeyElement('celestial', 'Celestial Warfare Key', 'CRAFT NORMAL', 'celestial_key.png');
    const godCard = this.createKeyElement('god', 'God Key', 'CRAFT GOD KEY', 'god_key.png');
    
    this.tiersContainer.appendChild(abyssalCard);
    this.tiersContainer.appendChild(celestialCard);
    this.tiersContainer.appendChild(godCard);
  }

  /**
   * Crée l'interface pour les Ancient Tokens
   */
  createTokenUI(): void {
    if (!this.tiersContainer) return;
    
    // Vider le conteneur avant de recréer
    this.tiersContainer.innerHTML = '';
    
    // Retirer tiers-grid et ajouter la classe pour le style spécifique des tokens
    this.tiersContainer.classList.remove('tiers-grid');
    this.tiersContainer.classList.add('tiers-container-keys');
    
    // Créer la carte pour l'input d'Ancient Token Cluster
    const tokenCard = document.createElement('div');
    tokenCard.className = 'tier';
    tokenCard.setAttribute('data-token-type', 'ancient-token');
    
    // Header
    const header = document.createElement('div');
    header.className = 'tier-header';
    
    // Image de l'Ancient Token
    const img = document.createElement('img');
    img.src = `${ICONS_PATH}ancient_token.png`;
    img.alt = 'Ancient Token Cluster';
    img.loading = 'lazy';
    img.className = 'tier-icon';
    
    // Info de l'Ancient Token (nom + catégorie)
    const info = document.createElement('div');
    info.className = 'tier-info';
    
    const name = document.createElement('div');
    name.className = 'tier-name';
    name.textContent = 'Ancient Token Cluster';
    
    const categorySpan = document.createElement('span');
    categorySpan.className = 'tier-category';
    categorySpan.textContent = 'ANCIENT TOKEN';
    
    info.appendChild(name);
    info.appendChild(categorySpan);
    
    header.appendChild(img);
    header.appendChild(info);
    
    // Description
    const description = document.createElement('p');
    description.className = 'tier-description';
    description.textContent = 'Entrez le nombre d\'Ancient Token Clusters que vous souhaitez craft.';
    
    // Counter
    const counter = document.createElement('div');
    counter.className = 'counter';
    
    const decrementBtn = document.createElement('button');
    decrementBtn.className = 'minus';
    decrementBtn.setAttribute('data-token-type', 'ancient-token');
    decrementBtn.setAttribute('data-token-action', 'decrement');
    decrementBtn.setAttribute('aria-label', 'Diminuer le nombre d\'Ancient Token Clusters');
    decrementBtn.textContent = '−';
    
    const input = document.createElement('input');
    input.type = 'number';
    input.id = 'count-ancient-token';
    input.className = 'count';
    input.setAttribute('data-token-type', 'ancient-token');
    input.min = String(APP_CONFIG.minCount);
    input.max = String(APP_CONFIG.maxCount);
    input.value = '0';
    input.setAttribute('aria-label', 'Nombre d\'Ancient Token Clusters');
    input.setAttribute('aria-describedby', 'token-description');
    input.setAttribute('aria-invalid', 'false');
    
    const incrementBtn = document.createElement('button');
    incrementBtn.className = 'plus';
    incrementBtn.setAttribute('data-token-type', 'ancient-token');
    incrementBtn.setAttribute('data-token-action', 'increment');
    incrementBtn.setAttribute('aria-label', 'Augmenter le nombre d\'Ancient Token Clusters');
    incrementBtn.textContent = '+';
    
    counter.appendChild(decrementBtn);
    counter.appendChild(input);
    counter.appendChild(incrementBtn);
    
    // Error message span (pour l'accessibilité)
    const errorSpan = document.createElement('span');
    errorSpan.className = 'error-message';
    errorSpan.id = 'token-description';
    errorSpan.setAttribute('role', 'alert');
    errorSpan.setAttribute('aria-live', 'polite');
    
    tokenCard.appendChild(header);
    tokenCard.appendChild(description);
    tokenCard.appendChild(counter);
    tokenCard.appendChild(errorSpan);
    
    this.tiersContainer.appendChild(tokenCard);
    
    // Stocker la référence à l'input
    this.tokenInput = input as HTMLInputElement;
    
    // Ajouter les event listeners pour l'input
    input.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      const value = parseInt(target.value, 10) || 0;
      this.handleTokenInputChange(value);
    });
    
    // Créer la carte pour Ancient Dino
    const ancientDinoCard = this.createAncientDinoCard();
    this.tiersContainer.appendChild(ancientDinoCard);
    
    // Forcer le reflow pour appliquer les styles
    this.tiersContainer.offsetHeight;
  }

  /**
   * Crée la carte pour Ancient Dino
   */
  createAncientDinoCard(): HTMLElement {
    const card = document.createElement('div');
    card.className = 'tier';
    card.setAttribute('data-token-type', 'ancient-dino');
    
    // Header
    const header = document.createElement('div');
    header.className = 'tier-header';
    
    // Image de l'Ancient Dino
    const img = document.createElement('img');
    img.src = `${ICONS_PATH}ancient_token.png`; // Utiliser la même icône ou une autre si disponible
    img.alt = 'Ancient Dino';
    img.loading = 'lazy';
    img.className = 'tier-icon';
    
    // Info de l'Ancient Dino (nom + catégorie)
    const info = document.createElement('div');
    info.className = 'tier-info';
    
    const name = document.createElement('div');
    name.className = 'tier-name';
    name.textContent = 'Ancient Dino';
    
    const categorySpan = document.createElement('span');
    categorySpan.className = 'tier-category';
    categorySpan.textContent = 'ANCIENT DINO';
    
    info.appendChild(name);
    info.appendChild(categorySpan);
    
    header.appendChild(img);
    header.appendChild(info);
    
    // Description
    const description = document.createElement('p');
    description.className = 'tier-description';
    description.textContent = 'Entrez le nombre d\'Ancient Token Clusters pour voir les ressources Ancient Dino nécessaires.';
    
    // Counter
    const counter = document.createElement('div');
    counter.className = 'counter';
    
    const decrementBtn = document.createElement('button');
    decrementBtn.className = 'minus';
    decrementBtn.setAttribute('data-token-type', 'ancient-dino');
    decrementBtn.setAttribute('data-token-action', 'decrement');
    decrementBtn.setAttribute('aria-label', 'Diminuer le nombre d\'Ancient Token Clusters pour Ancient Dino');
    decrementBtn.textContent = '−';
    
    const input = document.createElement('input');
    input.type = 'number';
    input.id = 'count-ancient-dino';
    input.className = 'count';
    input.setAttribute('data-token-type', 'ancient-dino');
    input.min = String(APP_CONFIG.minCount);
    input.max = String(APP_CONFIG.maxCount);
    input.value = '0';
    input.setAttribute('aria-label', 'Nombre d\'Ancient Token Clusters pour Ancient Dino');
    input.setAttribute('aria-describedby', 'ancient-dino-description');
    input.setAttribute('aria-invalid', 'false');
    
    const incrementBtn = document.createElement('button');
    incrementBtn.className = 'plus';
    incrementBtn.setAttribute('data-token-type', 'ancient-dino');
    incrementBtn.setAttribute('data-token-action', 'increment');
    incrementBtn.setAttribute('aria-label', 'Augmenter le nombre d\'Ancient Token Clusters pour Ancient Dino');
    incrementBtn.textContent = '+';
    
    counter.appendChild(decrementBtn);
    counter.appendChild(input);
    counter.appendChild(incrementBtn);
    
    // Error message span (pour l'accessibilité)
    const errorSpan = document.createElement('span');
    errorSpan.className = 'error-message';
    errorSpan.id = 'ancient-dino-description';
    errorSpan.setAttribute('role', 'alert');
    errorSpan.setAttribute('aria-live', 'polite');
    
    card.appendChild(header);
    card.appendChild(description);
    card.appendChild(counter);
    card.appendChild(errorSpan);
    
    // Stocker la référence à l'input
    this.ancientDinoInput = input as HTMLInputElement;
    
    // Ajouter les event listeners pour l'input
    input.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      const value = parseInt(target.value, 10) || 0;
      this.handleAncientDinoInputChange(value);
    });
    
    return card;
  }

  /**
   * Crée un élément clé (style carte similaire aux tiers)
   * @param keyType - Type de clé ('abyssal', 'celestial', 'god')
   * @param keyLabel - Label de la clé
   * @param category - Catégorie (CRAFT NORMAL ou CRAFT GOD KEY)
   * @param iconName - Nom de l'icône
   * @returns L'élément DOM
   */
  createKeyElement(keyType: 'abyssal' | 'celestial' | 'god', keyLabel: string, category: string, iconName: string): HTMLElement {
    const card = document.createElement('div');
    card.className = 'tier'; // Même classe pour le même style
    card.setAttribute('data-key-type', keyType);

    // Header de la carte (image + info)
    const header = document.createElement('div');
    header.className = 'tier-header';

    // Image de la clé
    const img = document.createElement('img');
    img.src = `${ICONS_PATH}${iconName}`;
    img.alt = keyLabel;
    img.loading = 'lazy';
    img.className = 'tier-icon';

    // Info de la clé (nom + catégorie)
    const info = document.createElement('div');
    info.className = 'tier-info';

    const name = document.createElement('div');
    name.className = 'tier-name';
    name.textContent = keyLabel;

    const categorySpan = document.createElement('span');
    categorySpan.className = 'tier-category';
    categorySpan.textContent = category;

    info.appendChild(name);
    info.appendChild(categorySpan);

    header.appendChild(img);
    header.appendChild(info);

    // Description
    const description = document.createElement('p');
    description.className = 'tier-description';
    if (keyType === 'god') {
      description.textContent = `Entrez le nombre de God Keys que vous souhaitez craft.`;
    } else {
      description.textContent = `Entrez le nombre de ${keyLabel} que vous souhaitez craft.`;
    }

    // Container du counter
    const counter = document.createElement('div');
    counter.className = 'counter';

    // Bouton moins
    const minusBtn = document.createElement('button');
    minusBtn.className = 'minus';
    minusBtn.setAttribute('data-key-type', keyType);
    minusBtn.setAttribute('data-action', 'decrement');
    minusBtn.setAttribute('aria-label', `Diminuer ${keyLabel}`);
    minusBtn.textContent = '−';

    // Input numérique
    const input = document.createElement('input');
    input.type = 'number';
    input.id = `count-${keyType}`;
    input.className = 'count';
    input.setAttribute('data-key-type', keyType);
    input.min = String(0);
    input.max = String(APP_CONFIG.maxCount);
    input.value = '0';
    input.step = '1'; // Pas de step spécial pour God Key
    input.setAttribute('aria-label', `Nombre de ${keyLabel}`);
    input.setAttribute('aria-describedby', `count-${keyType}-desc`);
    input.setAttribute('aria-invalid', 'false');
    
    // Description pour l'accessibilité
    const inputDesc = document.createElement('span');
    inputDesc.id = `count-${keyType}-desc`;
    inputDesc.className = 'sr-only';
    inputDesc.textContent = `Valeur entre 0 et ${APP_CONFIG.maxCount}`;

    // Stocker référence dans le cache
    this.keyInputs[keyType] = input as HTMLInputElement;

    // Bouton plus
    const plusBtn = document.createElement('button');
    plusBtn.className = 'plus';
    plusBtn.setAttribute('data-key-type', keyType);
    plusBtn.setAttribute('data-action', 'increment');
    plusBtn.setAttribute('aria-label', `Augmenter ${keyLabel}`);
    plusBtn.textContent = '+';

    // Assembler le counter
    counter.appendChild(minusBtn);
    counter.appendChild(input);
    counter.appendChild(inputDesc);
    counter.appendChild(plusBtn);

    // Assembler la carte
    card.appendChild(header);
    card.appendChild(description);
    card.appendChild(counter);

    return card;
  }

  /**
   * Affiche l'état vide pour ancient-token
   */
  showEmptyState(): void {
    if (!this.tiersContainer) return;
    this.tiersContainer.innerHTML = '<p class="empty-state">Cette fonctionnalité sera disponible prochainement</p>';
  }


  /**
   * Crée un élément tier (style carte)
   * @param tier - Le nom du tier
   * @returns L'élément DOM
   */
  createTierElement(tier: string): HTMLElement {
    const card = document.createElement('div');
    card.className = 'tier';
    card.setAttribute('data-tier', tier);

    // Header de la carte (image + info)
    const header = document.createElement('div');
    header.className = 'tier-header';

    // Image du tier
    const img = document.createElement('img');
    img.src = `${ICONS_PATH}${tier}.png`;
    img.alt = getTierLabel(tier);
    img.loading = 'lazy';
    img.className = 'tier-icon';

    // Info du tier (nom + catégorie)
    const info = document.createElement('div');
    info.className = 'tier-info';

    const name = document.createElement('div');
    name.className = 'tier-name';
    name.textContent = getTierLabel(tier);

    const category = document.createElement('span');
    category.className = 'tier-category';
    category.textContent = this.getTierCategory(tier);

    info.appendChild(name);
    info.appendChild(category);

    header.appendChild(img);
    header.appendChild(info);

    // Description
    const description = document.createElement('p');
    description.className = 'tier-description';
    description.textContent = `Sélectionnez la quantité de ${getTierLabel(tier)} nécessaire pour votre calcul.`;

    // Container du counter
    const counter = document.createElement('div');
    counter.className = 'counter';

    // Bouton moins
    const minusBtn = document.createElement('button');
    minusBtn.className = 'minus';
    minusBtn.setAttribute('data-tier', tier);
    minusBtn.setAttribute('data-action', 'decrement');
    minusBtn.setAttribute('aria-label', `Diminuer ${getTierLabel(tier)}`);
    minusBtn.textContent = '−';

    // Input numérique
    const input = document.createElement('input');
    input.type = 'number';
    input.id = `count-${tier}`;
    input.className = 'count';
    input.setAttribute('data-tier', tier);
    input.min = String(APP_CONFIG.minCount);
    input.max = String(APP_CONFIG.maxCount);
    input.value = String(this.calculator.getTier(tier));
    input.setAttribute('aria-label', `Quantité ${getTierLabel(tier)}`);
    input.setAttribute('aria-describedby', `count-${tier}-desc`);
    input.setAttribute('aria-invalid', 'false');
    
    // Description pour l'accessibilité
    const inputDesc = document.createElement('span');
    inputDesc.id = `count-${tier}-desc`;
    inputDesc.className = 'sr-only';
    inputDesc.textContent = `Valeur entre ${APP_CONFIG.minCount} et ${APP_CONFIG.maxCount}`;

    // Stocker référence dans le cache
    this.tierInputs[tier] = input as HTMLInputElement;

    // Bouton plus
    const plusBtn = document.createElement('button');
    plusBtn.className = 'plus';
    plusBtn.setAttribute('data-tier', tier);
    plusBtn.setAttribute('data-action', 'increment');
    plusBtn.setAttribute('aria-label', `Augmenter ${getTierLabel(tier)}`);
    plusBtn.textContent = '+';

    // Assembler le counter
    counter.appendChild(minusBtn);
    counter.appendChild(input);
    counter.appendChild(inputDesc);
    counter.appendChild(plusBtn);

    // Assembler la carte
    card.appendChild(header);
    card.appendChild(description);
    card.appendChild(counter);

    return card;
  }

  /**
   * Détermine la catégorie d'un tier pour l'affichage
   * @param tier - Le nom du tier
   * @returns La catégorie
   */
  getTierCategory(tier: string): string {
    if (tier.startsWith('T4')) return 'TIER 4';
    if (tier.startsWith('T5')) return 'TIER 5';
    if (tier.startsWith('T6')) return 'TIER 6';
    if (tier.startsWith('T7')) return 'TIER 7';
    if (tier.startsWith('T8')) return 'TIER 8';
    if (tier.includes('Celestial')) return 'CÉLESTE';
    if (tier.includes('Abyssal')) return 'ABYSSAL';
    return 'TIER';
  }

  /**
   * Configure les event listeners (UNE SEULE FOIS)
   * FIX: Évite la fuite mémoire en utilisant la délégation d'événements
   */
  setupEventListeners(): void {
    if (!this.tiersContainer) return;

    // Délégation d'événements sur le conteneur des tiers
    this.tiersContainer.addEventListener('click', this.handleTierClick.bind(this));
    this.tiersContainer.addEventListener('input', this.handleTierInput.bind(this));

    // Événement sur le bouton reset
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', this.handleReset.bind(this));
    }

    // Listeners pour les touches Enter sur les inputs
    this.tiersContainer.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  /**
   * Gère les clics sur les boutons (délégation)
   * @param event - L'événement click
   */
  handleTierClick(event: Event): void {
    const target = event.target as HTMLElement;
    const button = target.closest('button');
    if (!button) return;

    const tier = button.getAttribute('data-tier');
    const keyType = button.getAttribute('data-key-type');
    const tokenType = button.getAttribute('data-token-type');
    const action = button.getAttribute('data-action') || button.getAttribute('data-token-action');

    // Gérer les tokens
    if (tokenType && action) {
      let input: HTMLInputElement | null = null;
      
      // Déterminer quel input utiliser selon le type
      if (tokenType === 'ancient-token') {
        input = this.tokenInput;
      } else if (tokenType === 'ancient-dino') {
        input = this.ancientDinoInput;
      }
      
      if (!input) return;

      let currentValue = parseInt(input.value, 10) || 0;
      const step = 1; // Toujours +1 ou -1

      switch (action) {
        case 'increment':
          currentValue += step;
          input.value = String(currentValue);
          if (tokenType === 'ancient-token') {
            this.handleTokenInputChange(currentValue);
          } else if (tokenType === 'ancient-dino') {
            this.handleAncientDinoInputChange(currentValue);
          }
          break;
        case 'decrement':
          currentValue = Math.max(0, currentValue - step);
          input.value = String(currentValue);
          if (tokenType === 'ancient-token') {
            this.handleTokenInputChange(currentValue);
          } else if (tokenType === 'ancient-dino') {
            this.handleAncientDinoInputChange(currentValue);
          }
          break;
      }
      return;
    }

    // Gérer les clés
    if (keyType && action) {
      const input = this.keyInputs[keyType as 'abyssal' | 'celestial' | 'god'];
      if (!input) return;

      let currentValue = parseInt(input.value, 10) || 0;
      const step = 1; // Toujours +1 ou -1 pour toutes les clés

      switch (action) {
        case 'increment':
          currentValue += step;
          input.value = String(currentValue);
          this.handleKeyInputChange(keyType, currentValue);
          break;
        case 'decrement':
          currentValue = Math.max(0, currentValue - step);
          input.value = String(currentValue);
          this.handleKeyInputChange(keyType, currentValue);
          break;
      }
      return;
    }

    // Gérer les tiers (code existant)
    if (!tier || !action) return;

    switch (action) {
      case 'increment':
        this.calculator.changeTier(tier, 1);
        break;
      case 'decrement':
        this.calculator.changeTier(tier, -1);
        break;
      case 'clear':
        this.calculator.clearTier(tier);
        break;
    }
  }

  /**
   * Gère les changements de valeur pour les tokens
   * @param value - Nouvelle valeur
   */
  handleTokenInputChange(value: number): void {
    const validValue = Math.max(0, Math.min(value, APP_CONFIG.maxCount));
    // Mettre à jour l'input si nécessaire
    if (this.tokenInput) {
      this.tokenInput.value = String(validValue);
    }
    // Mettre à jour les résultats
    this.updateResults();
  }

  /**
   * Obtient la valeur actuelle du token
   * @returns Valeur actuelle
   */
  getTokenValue(): number {
    // Pour l'instant, retourner 0 car les tokens ne sont pas stockés dans Calculator
    // Ils sont gérés directement dans UI comme les clés
    return parseInt(this.tokenInput?.value || '0', 10) || 0;
  }

  /**
   * Gère les changements de valeur pour Ancient Dino
   * @param value - Nouvelle valeur
   */
  handleAncientDinoInputChange(value: number): void {
    const validValue = Math.max(0, Math.min(value, APP_CONFIG.maxCount));
    // Mettre à jour l'input si nécessaire
    if (this.ancientDinoInput) {
      this.ancientDinoInput.value = String(validValue);
    }
    // Mettre à jour les résultats
    this.updateResults();
  }

  /**
   * Obtient la valeur actuelle d'Ancient Dino
   * @returns Valeur actuelle
   */
  getAncientDinoValue(): number {
    return parseInt(this.ancientDinoInput?.value || '0', 10) || 0;
  }

  /**
   * Gère les changements de valeur pour les clés
   * @param keyType - Type de clé
   * @param value - Nouvelle valeur
   */
  handleKeyInputChange(keyType: 'abyssal' | 'celestial' | 'god', value: number): void {
    // Mettre à jour les résultats
    this.updateResults();
  }

  /**
   * Gère les changements d'input (debounced)
   * @param event - L'événement input
   */
  handleTierInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input || !input.classList.contains('count')) return;

    const tier = input.getAttribute('data-tier');
    const keyType = input.getAttribute('data-key-type');
    const tokenType = input.getAttribute('data-token-type');

    // Gérer les tokens
    if (tokenType) {
      const value = parseInt(input.value, 10) || 0;
      if (tokenType === 'ancient-token') {
        this.handleTokenInputChange(value);
      } else if (tokenType === 'ancient-dino') {
        this.handleAncientDinoInputChange(value);
      }
      return;
    }

    // Gérer les clés
    if (keyType) {
      const value = parseInt(input.value, 10) || 0;
      this.handleKeyInputChange(keyType as 'abyssal' | 'celestial' | 'god', value);
      return;
    }

    // Gérer les tiers (code existant)
    if (!tier) return;

    // Validation WCAG: gestion des erreurs
    const value = parseInt(input.value, 10);
    const min = APP_CONFIG.minCount;
    const max = APP_CONFIG.maxCount;
    const isValid = !isNaN(value) && value >= min && value <= max;
    
    input.setAttribute('aria-invalid', isValid ? 'false' : 'true');
    
    // Gestion des messages d'erreur pour l'accessibilité (WCAG 3.3.1)
    const descId = input.getAttribute('aria-describedby');
    if (descId) {
      const desc = document.getElementById(descId);
      if (desc) {
        if (!isValid) {
          desc.textContent = `Erreur: La valeur doit être entre ${min} et ${max}`;
          desc.className = 'error-message';
        } else {
          desc.textContent = `Valeur entre ${min} et ${max}`;
          desc.className = 'sr-only';
        }
      }
    }

    // Debounce pour éviter trop de mises à jour
    if (this.inputTimeout) {
      clearTimeout(this.inputTimeout);
    }
    this.inputTimeout = setTimeout(() => {
      if (isValid) {
        this.calculator.setTier(tier, value);
      } else {
        // Réinitialiser à la valeur précédente si invalide
        input.value = String(this.calculator.getTier(tier));
      }
    }, APP_CONFIG.inputDebounceDelay);
  }

  /**
   * Gère les touches clavier
   * @param event - L'événement keydown
   */
  handleKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    if (target && target.classList.contains('count') && event.key === 'Enter') {
      event.preventDefault();
      target.blur();
    }
  }

  /**
   * Gère le reset global
   */
  handleReset(): void {
    const calculatorType = this.calculator.getCalculatorType();
    
    if (calculatorType === 'key') {
      // Réinitialiser les inputs de clés
      if (this.keyInputs.abyssal) this.keyInputs.abyssal.value = '0';
      if (this.keyInputs.celestial) this.keyInputs.celestial.value = '0';
      if (this.keyInputs.god) this.keyInputs.god.value = '0';
      this.updateResults();
      this.showToast('Tous les compteurs de clés ont été réinitialisés');
    } else if (calculatorType === 'ancient-token') {
      // Réinitialiser les inputs de token et ancient dino
      if (this.tokenInput) this.tokenInput.value = '0';
      if (this.ancientDinoInput) this.ancientDinoInput.value = '0';
      this.updateResults();
      this.showToast('Les compteurs d\'Ancient Token Clusters et Ancient Dino ont été réinitialisés');
    } else {
      this.calculator.reset();
      this.showToast('Tous les compteurs ont été réinitialisés');
    }
  }

  /**
   * Callback appelé quand le calculator change
   * @param tier - Le tier modifié (null = reset global)
   * @param value - La nouvelle valeur
   */
  onCalculatorChange(tier: string | null, value: number | null): void {
    if (tier === null) {
      // Reset global - mettre à jour tous les inputs
      TIERS.forEach(t => {
        const input = this.tierInputs[t];
        if (input) {
          input.value = String(this.calculator.getTier(t));
        }
      });
    } else {
      // Mise à jour d'un tier spécifique
      const input = this.tierInputs[tier];
      if (input && value !== null) {
        input.value = String(value);
      }
    }

    // Mettre à jour les résultats
    this.updateResults();
  }

  /**
   * Met à jour l'affichage des résultats
   * Optimisé: compare avec les résultats précédents et update uniquement ce qui change
   * Méthode publique pour permettre la mise à jour depuis l'extérieur
   */
  updateResults(): void {
    if (!this.resultsContainer) return;
    
    const calculatorType = this.calculator.getCalculatorType();
    
    // Gérer les calculs de clés différemment
    if (calculatorType === 'key') {
      this.updateKeyResults();
      return;
    }
    
    // Gérer les calculs de tokens différemment
    if (calculatorType === 'ancient-token') {
      this.updateTokenResults();
      return;
    }
    
    // Calcul normal pour les tiers (boss)
    this.updateBossResults();
  }

  /**
   * Met à jour l'affichage des résultats pour le Boss Calculator
   * Séparé par tiers pour une meilleure lisibilité
   */
  updateBossResults(): void {
    if (!this.resultsContainer) return;
    
    const results = this.calculator.calculateSorted();

    // Si aucun résultat, afficher un message
    if (results.length === 0) {
      this.resultsContainer.innerHTML = '<p class="no-results">Sélectionnez des tiers pour voir les ressources nécessaires</p>';
      return;
    }

    // Vider le conteneur
    this.resultsContainer.innerHTML = '';

    // Grouper les résultats par tier
    const resultsByTier: Record<string, Array<{ item: string; quantity: number; icon: string }>> = {};
    
    // Obtenir les sélections de tiers
    const tierSelections = this.calculator.getSelection();
    
    // Pour chaque tier sélectionné, calculer ses ressources
    for (const [tier, count] of Object.entries(tierSelections)) {
      if (count > 0 && TIERS.includes(tier)) {
        // Calculer les ressources pour ce tier spécifique
        const tierResults = this.calculator.calculateForTier(tier);
        
        if (Object.keys(tierResults).length > 0) {
          resultsByTier[tier] = Object.entries(tierResults)
            .map(([item, quantity]) => ({
              item,
              quantity,
              icon: DATABASE[item]?.icon || `${ICONS_PATH}default.png`
            }))
            .sort((a, b) => b.quantity - a.quantity);
        }
      }
    }

    // Afficher les résultats par tier
    for (const [tier, tierResults] of Object.entries(resultsByTier)) {
      if (tierResults.length > 0) {
        // Titre de section pour le tier
        const sectionTitle = document.createElement('h3');
        sectionTitle.className = 'results-section-title';
        sectionTitle.textContent = getTierLabel(tier);
        this.resultsContainer.appendChild(sectionTitle);
        
        // Afficher les résultats du tier
        tierResults.forEach(({ item, quantity, icon }) => {
          const resultDiv = this.createResultElement(item, quantity, icon);
          this.resultsContainer!.appendChild(resultDiv);
        });
      }
    }
  }

  /**
   * Met à jour l'affichage des résultats pour les clés
   * Séparé par type de clé pour une meilleure lisibilité
   */
  updateKeyResults(): void {
    if (!this.resultsContainer) return;
    
    // Récupérer les valeurs des inputs de clés
    const abyssalCount = parseInt(this.keyInputs.abyssal?.value || '0', 10) || 0;
    const celestialCount = parseInt(this.keyInputs.celestial?.value || '0', 10) || 0;
    const godCount = parseInt(this.keyInputs.god?.value || '0', 10) || 0;
    
    // Si aucune clé n'est sélectionnée
    if (abyssalCount === 0 && celestialCount === 0 && godCount === 0) {
      this.resultsContainer.innerHTML = '<p class="no-results">Entrez le nombre de clés souhaitées pour voir les ressources nécessaires</p>';
      return;
    }
    
    // Vider le conteneur
    this.resultsContainer.innerHTML = '';
    
    // Section 1: Abyssal Warfare Key
    if (abyssalCount > 0) {
      const abyssalResources = calculateAbyssalKeyResources(abyssalCount);
      
      const filteredResources: Array<{ name: string; quantity: number }> = [];
      for (const [name, quantity] of Object.entries(abyssalResources)) {
        if (quantity > 0) {
          filteredResources.push({ name, quantity: Math.ceil(quantity) });
        }
      }
      
      filteredResources.sort((a, b) => b.quantity - a.quantity);
      
      if (filteredResources.length > 0) {
        const sectionTitle = document.createElement('h3');
        sectionTitle.className = 'results-section-title';
        sectionTitle.textContent = 'Abyssal Warfare Key';
        this.resultsContainer.appendChild(sectionTitle);
        
        filteredResources.forEach(({ name, quantity }) => {
          const itemData = DATABASE[name];
          const itemIcon = itemData?.icon || `${ICONS_PATH}default.png`;
          const resultDiv = this.createResultElement(name, quantity, itemIcon);
          this.resultsContainer!.appendChild(resultDiv);
        });
      }
    }
    
    // Section 2: Celestial Warfare Key
    if (celestialCount > 0) {
      const celestialResources = calculateCelestialKeyResources(celestialCount);
      
      const filteredResources: Array<{ name: string; quantity: number }> = [];
      for (const [name, quantity] of Object.entries(celestialResources)) {
        if (quantity > 0) {
          filteredResources.push({ name, quantity: Math.ceil(quantity) });
        }
      }
      
      filteredResources.sort((a, b) => b.quantity - a.quantity);
      
      if (filteredResources.length > 0) {
        const sectionTitle = document.createElement('h3');
        sectionTitle.className = 'results-section-title';
        sectionTitle.textContent = 'Celestial Warfare Key';
        this.resultsContainer.appendChild(sectionTitle);
        
        filteredResources.forEach(({ name, quantity }) => {
          const itemData = DATABASE[name];
          const itemIcon = itemData?.icon || `${ICONS_PATH}default.png`;
          const resultDiv = this.createResultElement(name, quantity, itemIcon);
          this.resultsContainer!.appendChild(resultDiv);
        });
      }
    }
    
    // Section 3: God Key
    if (godCount > 0) {
      const godResources = calculateGodKeyResources(godCount);
      
      const filteredResources: Array<{ name: string; quantity: number }> = [];
      for (const [name, quantity] of Object.entries(godResources)) {
        if (quantity > 0) {
          filteredResources.push({ name, quantity: Math.ceil(quantity) });
        }
      }
      
      filteredResources.sort((a, b) => b.quantity - a.quantity);
      
      if (filteredResources.length > 0) {
        const sectionTitle = document.createElement('h3');
        sectionTitle.className = 'results-section-title';
        sectionTitle.textContent = 'God Key';
        this.resultsContainer.appendChild(sectionTitle);
        
        filteredResources.forEach(({ name, quantity }) => {
          const itemData = DATABASE[name];
          const itemIcon = itemData?.icon || `${ICONS_PATH}default.png`;
          const resultDiv = this.createResultElement(name, quantity, itemIcon);
          this.resultsContainer!.appendChild(resultDiv);
        });
      }
    }
    
    // Si aucune ressource n'est affichée
    if (this.resultsContainer.children.length === 0) {
      this.resultsContainer.innerHTML = '<p class="no-results">Aucune ressource nécessaire</p>';
    }
  }

  /**
   * Met à jour l'affichage des résultats pour les tokens
   */
  updateTokenResults(): void {
    if (!this.resultsContainer) return;
    
    // Récupérer les valeurs des inputs
    const tokenCount = parseInt(this.tokenInput?.value || '0', 10) || 0;
    const ancientDinoCount = parseInt(this.ancientDinoInput?.value || '0', 10) || 0;
    
    // Si aucun token n'est sélectionné
    if (tokenCount === 0 && ancientDinoCount === 0) {
      this.resultsContainer.innerHTML = '<p class="no-results">Entrez le nombre d\'Ancient Token Clusters souhaités pour voir les ressources nécessaires</p>';
      return;
    }
    
    // Vider le conteneur
    this.resultsContainer.innerHTML = '';
    
    // Section 1: Ancient Token Cluster (Tokens)
    if (tokenCount > 0) {
      const tokenResources = calculateTokenResources(tokenCount);
      
      // Filtrer les ressources à 0
      const filteredTokens: Array<{ name: string; quantity: number }> = [];
      for (const [name, quantity] of Object.entries(tokenResources)) {
        if (quantity > 0) {
          filteredTokens.push({ name, quantity: Math.ceil(quantity) });
        }
      }
      
      // Trier par quantité décroissante
      filteredTokens.sort((a, b) => b.quantity - a.quantity);
      
      if (filteredTokens.length > 0) {
        // Titre de section
        const sectionTitle = document.createElement('h3');
        sectionTitle.className = 'results-section-title';
        sectionTitle.textContent = 'Ancient Token Cluster';
        this.resultsContainer.appendChild(sectionTitle);
        
        // Afficher les tokens
        filteredTokens.forEach(({ name, quantity }) => {
          // Utiliser l'icône spécifique du token si disponible, sinon utiliser l'icône par défaut
          let itemIcon = TOKEN_ICONS[name] || `${ICONS_PATH}ancient_token.png`;
          
          const resultDiv = this.createResultElement(name, quantity, itemIcon);
          this.resultsContainer!.appendChild(resultDiv);
        });
      }
    }
    
    // Section 2: Ancient Dino (Ressources)
    if (ancientDinoCount > 0) {
      const ancientDinoResources = calculateTokenItemResources(ancientDinoCount);
      
      // Filtrer les ressources à 0
      const filteredResources: Array<{ name: string; quantity: number }> = [];
      for (const [name, quantity] of Object.entries(ancientDinoResources)) {
        if (quantity > 0) {
          filteredResources.push({ name, quantity: Math.ceil(quantity) });
        }
      }
      
      // Trier par quantité décroissante
      filteredResources.sort((a, b) => b.quantity - a.quantity);
      
      if (filteredResources.length > 0) {
        // Titre de section
        const sectionTitle = document.createElement('h3');
        sectionTitle.className = 'results-section-title';
        sectionTitle.textContent = 'Ancient Dino';
        this.resultsContainer.appendChild(sectionTitle);
        
        // Afficher les ressources
        filteredResources.forEach(({ name, quantity }) => {
          // Chercher l'icône dans la database
          let itemIcon = `${ICONS_PATH}default.png`;
          
          const itemData = DATABASE[name];
          if (itemData?.icon) {
            itemIcon = itemData.icon;
          }
          
          const resultDiv = this.createResultElement(name, quantity, itemIcon);
          this.resultsContainer!.appendChild(resultDiv);
        });
      }
    }
    
    // Si aucune ressource n'est affichée
    if (this.resultsContainer.children.length === 0) {
      this.resultsContainer.innerHTML = '<p class="no-results">Aucune ressource nécessaire</p>';
    }
  }

  /**
   * Crée un élément de résultat
   * @param item - Le nom de l'item
   * @param quantity - La quantité
   * @param icon - Le chemin de l'icône
   * @returns L'élément DOM
   */
  createResultElement(item: string, quantity: number, icon: string): HTMLElement {
    const div = document.createElement('div');
    div.className = 'result';
    div.setAttribute('data-item', item);

    const img = document.createElement('img');
    img.src = icon;
    img.alt = item;
    img.loading = 'lazy';

    const label = document.createElement('span');
    label.textContent = `${item}: `;

    const value = document.createElement('strong');
    value.textContent = String(quantity);

    div.appendChild(img);
    div.appendChild(label);
    div.appendChild(value);

    return div;
  }

  /**
   * Affiche une notification toast
   * @param message - Le message à afficher
   * @param duration - Durée d'affichage en ms
   */
  showToast(message: string, duration: number = APP_CONFIG.toastDuration): void {
    // Supprimer le toast précédent s'il existe
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    document.body.appendChild(toast);

    // Forcer un reflow pour que l'animation fonctionne
    toast.offsetHeight;
    toast.style.opacity = '1';

    // Supprimer après la durée spécifiée
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastTimeout = setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  /**
   * Affiche une boîte de dialogue pour exporter
   */
  async showExportDialog(): Promise<void> {
    const formats: Array<{ value: ExportFormat; label: string }> = [
      { value: 'text', label: 'Texte' },
      { value: 'markdown', label: 'Markdown' },
      { value: 'csv', label: 'CSV' },
      { value: 'json', label: 'JSON' }
    ];

    // Créer un dialog simple (TODO: améliorer avec un vrai modal)
    const format = prompt(`Format d'export:\n${formats.map((f, i) => `${i + 1}. ${f.label}`).join('\n')}\n\nEntrez le numéro:`);

    if (format === null) return;

    const index = parseInt(format, 10) - 1;
    const formatEntry = formats[index];
    if (index >= 0 && index < formats.length && formatEntry) {
      const selectedFormat = formatEntry.value;
      const exportData = this.calculator.exportResults(selectedFormat);

      // Copier dans le presse-papier
      await this.copyToClipboard(exportData);
      this.showToast(`Résultats exportés en ${formatEntry.label} et copiés !`);
    }
  }

  /**
   * Copie du texte dans le presse-papier
   * @param text - Le texte à copier
   */
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Erreur lors de la copie:', error);

      // Fallback pour les navigateurs plus anciens
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      return true;
    }
  }

  /**
   * Télécharge un fichier
   * @param content - Le contenu du fichier
   * @param filename - Le nom du fichier
   * @param mimeType - Le type MIME
   */
  downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }

  /**
   * Affiche un modal de confirmation
   * @param message - Le message
   * @returns Promise résolue avec true si confirmé
   */
  async confirm(message: string): Promise<boolean> {
    // Pour l'instant, utiliser confirm natif
    // TODO: Créer un vrai modal personnalisé
    return window.confirm(message);
  }

  /**
   * Met à jour les compteurs affichés
   */
  refreshCounters(): void {
    TIERS.forEach(tier => {
      const input = this.tierInputs[tier];
      if (input) {
        input.value = String(this.calculator.getTier(tier));
      }
    });
  }
}
