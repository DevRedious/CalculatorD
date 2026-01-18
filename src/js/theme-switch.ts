/**
 * ThemeSwitch Component - Vanilla TypeScript implementation
 * Provides a theme switcher with three modes: light, dark, system
 * Uses icon-click variant with Sun, Moon, and Laptop icons
 */

import { APP_CONFIG } from './config';

export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * SVG Icons for theme modes
 */
const ICONS = {
  sun: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M12 2v2"></path>
    <path d="M12 20v2"></path>
    <path d="m4.93 4.93 1.41 1.41"></path>
    <path d="m17.66 17.66 1.41 1.41"></path>
    <path d="M2 12h2"></path>
    <path d="M20 12h2"></path>
    <path d="m6.34 17.66-1.41 1.41"></path>
    <path d="m19.07 4.93-1.41 1.41"></path>
  </svg>`,
  moon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
  </svg>`,
  laptop: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect width="18" height="12" x="3" y="4" rx="2" ry="2"></rect>
    <line x1="2" x2="22" y1="20" y2="20"></line>
  </svg>`
};

/**
 * ThemeSwitch Component Class
 */
export class ThemeSwitch {
  private container: HTMLElement;
  private currentMode: ThemeMode;
  private modes: ThemeMode[] = ['light', 'dark', 'system'];
  private onModeChange?: (mode: ThemeMode) => void;
  private mediaQueryListener?: (e: MediaQueryListEvent) => void;

  constructor(containerId: string, onModeChange?: (mode: ThemeMode) => void) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.container = container;
    this.onModeChange = onModeChange;
    
    // Load saved theme or default
    const savedTheme = localStorage.getItem(APP_CONFIG.themeStorageKey);
    if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
      this.currentMode = savedTheme;
    } else {
      this.currentMode = APP_CONFIG.defaultTheme === 'light' ? 'light' : 'dark';
    }
    
    this.render();
    this.setupEventListeners();
    this.applyTheme();
  }

  /**
   * Renders the theme switch component
   */
  private render(): void {
    this.container.innerHTML = '';
    this.container.className = 'theme-switch-container';
    
    const switchElement = document.createElement('div');
    switchElement.className = 'theme-switch';
    switchElement.setAttribute('role', 'group');
    switchElement.setAttribute('aria-label', 'Sélectionner le thème');
    
    // Create buttons for each mode
    this.modes.forEach((mode) => {
      const button = document.createElement('button');
      button.className = `theme-switch-button ${mode === this.currentMode ? 'active' : ''}`;
      button.setAttribute('data-mode', mode);
      button.setAttribute('aria-label', this.getModeLabel(mode));
      button.setAttribute('aria-pressed', mode === this.currentMode ? 'true' : 'false');
      button.setAttribute('type', 'button');
      
      // Add icon (safe: getIcon returns static SVG strings defined in code)
      const iconWrapper = document.createElement('span');
      iconWrapper.className = 'theme-switch-icon';
      // Use DOMParser to safely parse SVG (avoids XSS warning)
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(this.getIcon(mode), 'image/svg+xml');
      const svgElement = svgDoc.documentElement;
      if (svgElement) {
        iconWrapper.appendChild(svgElement);
      }
      button.appendChild(iconWrapper);
      
      switchElement.appendChild(button);
    });
    
    this.container.appendChild(switchElement);
  }

  /**
   * Gets the icon for a theme mode
   */
  private getIcon(mode: ThemeMode): string {
    switch (mode) {
      case 'light':
        return ICONS.sun;
      case 'dark':
        return ICONS.moon;
      case 'system':
        return ICONS.laptop;
    }
  }

  /**
   * Gets the label for a theme mode
   */
  private getModeLabel(mode: ThemeMode): string {
    switch (mode) {
      case 'light':
        return 'Mode clair';
      case 'dark':
        return 'Mode sombre';
      case 'system':
        return 'Mode système';
    }
  }

  /**
   * Sets up event listeners
   */
  private setupEventListeners(): void {
    const buttons = this.container.querySelectorAll('.theme-switch-button');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const mode = button.getAttribute('data-mode') as ThemeMode;
        if (mode) {
          this.setMode(mode);
        }
      });
    });

    // Listen for system theme changes (only set up once)
    if (window.matchMedia && !this.mediaQueryListener) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQueryListener = () => {
        if (this.currentMode === 'system') {
          this.applyTheme();
        }
      };
      mediaQuery.addEventListener('change', this.mediaQueryListener);
    }
  }

  /**
   * Sets the theme mode
   */
  public setMode(mode: ThemeMode): void {
    if (this.currentMode === mode) return;
    
    this.currentMode = mode;
    localStorage.setItem(APP_CONFIG.themeStorageKey, mode);
    
    this.render();
    this.setupEventListeners();
    this.applyTheme();
    
    if (this.onModeChange) {
      this.onModeChange(mode);
    }
  }

  /**
   * Gets the current theme mode
   */
  public getMode(): ThemeMode {
    return this.currentMode;
  }

  /**
   * Gets the effective theme (resolves 'system' to actual theme)
   */
  public getEffectiveTheme(): 'light' | 'dark' {
    if (this.currentMode === 'system') {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    }
    return this.currentMode;
  }

  /**
   * Applies the theme to the document
   */
  private applyTheme(): void {
    const effectiveTheme = this.getEffectiveTheme();
    document.documentElement.setAttribute('data-theme', effectiveTheme);
  }
}
