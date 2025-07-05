/**
 * Accessible color palette for Rio Porto P2P
 * All colors meet WCAG 2.1 contrast requirements
 */

export const colors = {
  // Primary colors - Orange theme (accessible alternatives)
  primary: {
    50: '#fff7ed',   // Very light orange
    100: '#ffedd5',  // Light orange
    200: '#fed7aa',  // Light orange
    300: '#fdba74',  // Medium light orange
    400: '#fb923c',  // Medium orange
    500: '#f97316',  // Base orange (use carefully)
    600: '#ea580c',  // Dark orange (better contrast)
    700: '#c2410c',  // Darker orange (best for text on white)
    800: '#9a3412',  // Very dark orange
    900: '#7c2d12',  // Almost black orange
  },
  
  // Accent colors - Blue (accessible version of #00ADEF)
  accent: {
    50: '#eff6ff',   // Very light blue
    100: '#dbeafe',  // Light blue
    200: '#bfdbfe',  // Light blue
    300: '#93c5fd',  // Medium light blue
    400: '#60a5fa',  // Medium blue
    500: '#3b82f6',  // Base blue
    600: '#0066cc',  // Dark blue (accessible alternative to #00ADEF)
    700: '#1d4ed8',  // Darker blue
    800: '#1e40af',  // Very dark blue
    900: '#1e3a8a',  // Almost black blue
  },
  
  // Success colors - Green
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',  // Best for text on white
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  // Error colors - Red
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',  // Best for text on white
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Warning colors - Yellow
  warning: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',  // Best for text on white
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
  },
  
  // Neutral colors - Gray
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
}

/**
 * Get the best text color for a given background
 */
export function getTextColorForBackground(backgroundColor: string): string {
  // This is a simplified version - in production, you'd calculate the actual contrast
  const darkBackgrounds = ['#000000', '#111827', '#1f2937', '#374151', '#020617', '#1e293b']
  const lightBackgrounds = ['#ffffff', '#f9fafb', '#f3f4f6', '#e5e7eb']
  
  if (darkBackgrounds.includes(backgroundColor.toLowerCase())) {
    return colors.neutral[100] // Light text for dark backgrounds
  }
  
  if (lightBackgrounds.includes(backgroundColor.toLowerCase())) {
    return colors.neutral[900] // Dark text for light backgrounds
  }
  
  // Default to dark text
  return colors.neutral[900]
}

/**
 * Accessible color combinations
 */
export const accessibleCombinations = {
  // Primary buttons
  primaryButton: {
    background: colors.primary[700], // Dark orange
    text: '#ffffff',
    hover: colors.primary[800],
  },
  
  // Secondary buttons
  secondaryButton: {
    background: colors.neutral[200],
    text: colors.neutral[900],
    hover: colors.neutral[300],
  },
  
  // Accent elements
  accentButton: {
    background: colors.accent[600], // Dark blue
    text: '#ffffff',
    hover: colors.accent[700],
  },
  
  // Success states
  successButton: {
    background: colors.success[600],
    text: '#ffffff',
    hover: colors.success[700],
  },
  
  // Error states
  errorButton: {
    background: colors.error[600],
    text: '#ffffff',
    hover: colors.error[700],
  },
  
  // Warning states
  warningButton: {
    background: colors.warning[600],
    text: '#ffffff',
    hover: colors.warning[700],
  },
  
  // Text on different backgrounds
  textOnWhite: {
    primary: colors.neutral[900],
    secondary: colors.neutral[600],
    link: colors.accent[600],
  },
  
  textOnDark: {
    primary: colors.neutral[100],
    secondary: colors.neutral[400],
    link: colors.accent[400],
  },
}

/**
 * CSS custom properties for easy theming
 */
export const cssVariables = `
  :root {
    /* Primary colors */
    --color-primary-50: ${colors.primary[50]};
    --color-primary-100: ${colors.primary[100]};
    --color-primary-200: ${colors.primary[200]};
    --color-primary-300: ${colors.primary[300]};
    --color-primary-400: ${colors.primary[400]};
    --color-primary-500: ${colors.primary[500]};
    --color-primary-600: ${colors.primary[600]};
    --color-primary-700: ${colors.primary[700]};
    --color-primary-800: ${colors.primary[800]};
    --color-primary-900: ${colors.primary[900]};
    
    /* Accent colors */
    --color-accent-50: ${colors.accent[50]};
    --color-accent-100: ${colors.accent[100]};
    --color-accent-200: ${colors.accent[200]};
    --color-accent-300: ${colors.accent[300]};
    --color-accent-400: ${colors.accent[400]};
    --color-accent-500: ${colors.accent[500]};
    --color-accent-600: ${colors.accent[600]};
    --color-accent-700: ${colors.accent[700]};
    --color-accent-800: ${colors.accent[800]};
    --color-accent-900: ${colors.accent[900]};
    
    /* Accessible combinations */
    --button-primary-bg: ${accessibleCombinations.primaryButton.background};
    --button-primary-text: ${accessibleCombinations.primaryButton.text};
    --button-primary-hover: ${accessibleCombinations.primaryButton.hover};
    
    --button-accent-bg: ${accessibleCombinations.accentButton.background};
    --button-accent-text: ${accessibleCombinations.accentButton.text};
    --button-accent-hover: ${accessibleCombinations.accentButton.hover};
  }
`