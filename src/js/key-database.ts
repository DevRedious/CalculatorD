/**
 * Database des coûts de référence pour les clés
 * Basé sur l'analyse de l'Excel "Key Calculator v1"
 */

export interface KeyCosts {
  abyssal: Record<string, number>;  // Coûts par clé Abyssal
  celestial: Record<string, number>; // Coûts par clé Celestial
  god: Record<string, number>;       // Coûts par God Key
}

/**
 * Base de données des coûts de référence pour les clés
 * Les valeurs sont les coûts PAR CLÉ (ou par God Key)
 */
export const KEY_COSTS: KeyCosts = {
  abyssal: {
    // Trophées Abyssal - 3 par clé
    "Abyssal Carcha Trophy": 3,
    "Abyssal Dodoreaper Trophy": 3,
    "Abyssal Dodorexy Trophy": 3,
    "Abyssal Drake Trophy": 3,
    "Abyssal Indominus Rex Trophy": 3,
    "Abyssal Manticore Trophy": 3,
    "Abyssal Spider Trophy": 3,
    "Abyssal Element": 3,
    "Abyssal Energy": 300,
    
    // Ressources communes
    "Element": 500,
    "Black Pearl": 500,
    "Oracle Essence": 100,
    "Unreal Essence": 500
  },
  
  celestial: {
    // Trophées Celestial - 3 par clé
    "Celestial Gigant Trophy": 3,
    "Celestial Gorilla Trophy": 3,
    "Celestial Rhynio Trophy": 3,
    "Celestial Rock Golem trophy": 3,
    "Celestial Rock Drake Trophy": 3,
    "Celestial Titano Trophy": 3,
    "Celestial Wyvern Trophy": 3,
    "Celestial Element": 3,
    "Celestial Energy": 300,
    
    // Ressources communes
    "Element": 500,
    "Black Pearl": 500,
    "Oracle Essence": 100,
    "Unreal Essence": 500
  },
  
  god: {
    // Energies - 200 par God Key
    "Abyssal Energy": 200,
    "Celestial Energy": 200,
    
    // Ressources spéciales
    "Ancient Token Cluster": 1,
    "Unreal Essence": 500,
    
    // Souls - 5 par God Key
    "Abyssal Carcha Soul": 5,
    "Abyssal Dodoreaper Soul": 5,
    "Abyssal Dodorexy Soul": 5,
    "Abyssal Drake Soul": 5,
    "Abyssal Indominus Rex Soul": 5,
    "Abyssal Manticore Soul": 5,
    "Abyssal Spider Soul": 5,
    "Celestial Gigant Soul": 5,
    "Celestial Gorilla Soul": 5,
    "Celestial Rhynio Soul": 5,
    "Celestial Rock Golem Soul": 5,
    "Celestial Rock Drake Soul": 5,
    "Celestial Titano Soul": 5,
    "Celestial Wyvern Soul": 5
  }
};

/**
 * Obtient le coût d'un composant pour une clé Abyssal
 * @param componentName - Nom du composant
 * @returns Coût par clé (0 si non trouvé)
 */
export function getAbyssalKeyCost(componentName: string): number {
  return KEY_COSTS.abyssal[componentName] || 0;
}

/**
 * Obtient le coût d'un composant pour une clé Celestial
 * @param componentName - Nom du composant
 * @returns Coût par clé (0 si non trouvé)
 */
export function getCelestialKeyCost(componentName: string): number {
  return KEY_COSTS.celestial[componentName] || 0;
}

/**
 * Obtient le coût d'un composant pour une God Key
 * @param componentName - Nom du composant
 * @returns Coût par God Key (0 si non trouvé)
 */
export function getGodKeyCost(componentName: string): number {
  return KEY_COSTS.god[componentName] || 0;
}

/**
 * Calcule les ressources nécessaires pour un nombre de clés Abyssal
 * @param numberOfKeys - Nombre de clés Abyssal
 * @returns Map des composants et leurs quantités nécessaires
 */
export function calculateAbyssalKeyResources(numberOfKeys: number): Record<string, number> {
  const resources: Record<string, number> = {};
  
  for (const [component, costPerKey] of Object.entries(KEY_COSTS.abyssal)) {
    resources[component] = costPerKey * numberOfKeys;
  }
  
  return resources;
}

/**
 * Calcule les ressources nécessaires pour un nombre de clés Celestial
 * @param numberOfKeys - Nombre de clés Celestial
 * @returns Map des composants et leurs quantités nécessaires
 */
export function calculateCelestialKeyResources(numberOfKeys: number): Record<string, number> {
  const resources: Record<string, number> = {};
  
  for (const [component, costPerKey] of Object.entries(KEY_COSTS.celestial)) {
    resources[component] = costPerKey * numberOfKeys;
  }
  
  return resources;
}

/**
 * Calcule les ressources nécessaires pour un nombre de God Keys
 * @param numberOfKeys - Nombre de God Keys souhaitées (1 clé = 1 God Key)
 * @returns Map des composants et leurs quantités nécessaires
 * 
 * Note: Utilise uniquement les ressources spécifiques aux God Keys (souls, énergies, Ancient Token, etc.)
 * Les ressources Abyssal et Celestial ne sont PAS incluses dans ce calcul
 */
export function calculateGodKeyResources(numberOfKeys: number): Record<string, number> {
  const resources: Record<string, number> = {};
  
  // Utiliser uniquement les ressources spécifiques aux God Keys
  // 1 clé saisie = 1 God Key (pas de division par 6)
  for (const [component, costPerGodKey] of Object.entries(KEY_COSTS.god)) {
    resources[component] = costPerGodKey * numberOfKeys;
  }
  
  return resources;
}

/**
 * Combine plusieurs maps de ressources en additionnant les valeurs
 * @param resourceMaps - Tableau de maps de ressources
 * @returns Map combinée
 */
export function combineResources(...resourceMaps: Record<string, number>[]): Record<string, number> {
  const combined: Record<string, number> = {};
  
  for (const resourceMap of resourceMaps) {
    for (const [component, quantity] of Object.entries(resourceMap)) {
      combined[component] = (combined[component] || 0) + quantity;
    }
  }
  
  return combined;
}
