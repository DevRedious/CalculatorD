/**
 * Database des coûts de référence pour les Ancient Tokens
 * Basé sur l'analyse de l'Excel "Ancient Token Calculator v1"
 */

export interface TokenCosts {
  tokens: Record<string, number>;      // Coûts des tokens (tous à 2)
  resources: Record<string, number>;    // Coûts des ressources par cluster
}

/**
 * Base de données des coûts de référence pour les Ancient Tokens
 * Les valeurs sont les coûts PAR ANCIENT TOKEN CLUSTER
 */
export const TOKEN_COSTS: TokenCosts = {
  tokens: {
    // Tous les tokens coûtent 2 par Ancient Token Cluster
    "Raptor Token": 2,
    "Carno Token": 2,
    "Bronto Token": 2,
    "Giga Token": 2,
    "Rex Token": 2,
    "Trice Token": 2,
    "Stego Token": 2,
    "Quetz Token": 2,
    "Wyvern Token": 2
  },
  
  resources: {
    // Coûts par Ancient Token Cluster
    "Black Pearl": 80,
    "Excellent Essence": 100,
    "Unreal Essence": 20,
    "Excellent Soul": 5,
    "Descended Essence": 200,
    "Artefact": 1
  }
};

/**
 * Obtient le coût d'un token par Ancient Token Cluster
 * @param tokenName - Nom du token
 * @returns Coût par cluster (0 si non trouvé)
 */
export function getTokenCost(tokenName: string): number {
  return TOKEN_COSTS.tokens[tokenName] || 0;
}

/**
 * Obtient le coût d'une ressource par Ancient Token Cluster
 * @param resourceName - Nom de la ressource
 * @returns Coût par cluster (0 si non trouvé)
 */
export function getResourceCost(resourceName: string): number {
  return TOKEN_COSTS.resources[resourceName] || 0;
}

/**
 * Calcule les tokens nécessaires pour un nombre d'Ancient Token Clusters
 * @param numberOfClusters - Nombre d'Ancient Token Clusters
 * @returns Map des tokens et leurs quantités nécessaires
 */
export function calculateTokenResources(numberOfClusters: number): Record<string, number> {
  const resources: Record<string, number> = {};
  
  for (const [token, costPerCluster] of Object.entries(TOKEN_COSTS.tokens)) {
    resources[token] = costPerCluster * numberOfClusters;
  }
  
  return resources;
}

/**
 * Calcule les ressources nécessaires pour un nombre d'Ancient Token Clusters
 * @param numberOfClusters - Nombre d'Ancient Token Clusters
 * @returns Map des ressources et leurs quantités nécessaires
 */
export function calculateTokenItemResources(numberOfClusters: number): Record<string, number> {
  const resources: Record<string, number> = {};
  
  for (const [resource, costPerCluster] of Object.entries(TOKEN_COSTS.resources)) {
    resources[resource] = costPerCluster * numberOfClusters;
  }
  
  return resources;
}

/**
 * Combine plusieurs maps de ressources en additionnant les valeurs
 * @param resourceMaps - Tableau de maps de ressources
 * @returns Map combinée
 */
export function combineTokenResources(...resourceMaps: Record<string, number>[]): Record<string, number> {
  const combined: Record<string, number> = {};
  
  for (const resourceMap of resourceMaps) {
    for (const [component, quantity] of Object.entries(resourceMap)) {
      combined[component] = (combined[component] || 0) + quantity;
    }
  }
  
  return combined;
}

/**
 * Calcule le nombre de mobs à faire pour un nombre de tokens
 * @param numberOfTokens - Nombre de tokens
 * @returns Nombre de mobs (arrondi à l'entier supérieur)
 */
export function calculateMobsNeeded(numberOfTokens: number): number {
  return Math.ceil(numberOfTokens / 20);
}
