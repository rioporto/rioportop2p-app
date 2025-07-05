/**
 * Utility functions to check and improve color contrast for accessibility
 * WCAG 2.1 Guidelines:
 * - Normal text: minimum 4.5:1 contrast ratio
 * - Large text (18pt+ or 14pt+ bold): minimum 3:1 contrast ratio
 * - UI components: minimum 3:1 contrast ratio
 */

interface RGB {
  r: number
  g: number
  b: number
}

interface ContrastResult {
  ratio: number
  passes: {
    normal: boolean
    large: boolean
    ui: boolean
  }
  recommendation?: string
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) {
    throw new Error('Invalid hex color')
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  }
}

/**
 * Calculate relative luminance of a color
 * https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
function getLuminance(rgb: RGB): number {
  const rsRGB = rgb.r / 255
  const gsRGB = rgb.g / 255
  const bsRGB = rgb.b / 255

  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4)
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4)
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4)

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Calculate contrast ratio between two colors
 * https://www.w3.org/WAI/GL/wiki/Contrast_ratio
 */
export function getContrastRatio(foreground: string, background: string): number {
  const fgRgb = hexToRgb(foreground)
  const bgRgb = hexToRgb(background)
  
  const fgLuminance = getLuminance(fgRgb)
  const bgLuminance = getLuminance(bgRgb)
  
  const lighter = Math.max(fgLuminance, bgLuminance)
  const darker = Math.min(fgLuminance, bgLuminance)
  
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Check if color contrast meets WCAG standards
 */
export function checkContrast(foreground: string, background: string): ContrastResult {
  const ratio = getContrastRatio(foreground, background)
  
  const result: ContrastResult = {
    ratio: Math.round(ratio * 100) / 100,
    passes: {
      normal: ratio >= 4.5,
      large: ratio >= 3,
      ui: ratio >= 3
    }
  }
  
  // Add recommendations if contrast fails
  if (!result.passes.normal) {
    if (ratio < 3) {
      result.recommendation = 'Contraste muito baixo. Considere usar cores com maior diferença de luminosidade.'
    } else if (ratio < 4.5) {
      result.recommendation = 'Contraste adequado apenas para texto grande (18pt+ ou 14pt+ bold).'
    }
  }
  
  return result
}

/**
 * Common color combinations in the app to check
 */
export const colorCombinations = [
  // Orange theme colors
  { name: 'Orange on white', fg: '#ea580c', bg: '#ffffff' }, // orange-600
  { name: 'Orange on dark', fg: '#ea580c', bg: '#1e293b' }, // orange-600 on slate-800
  { name: 'Light orange on white', fg: '#f97316', bg: '#ffffff' }, // orange-500
  { name: 'Dark orange on white', fg: '#c2410c', bg: '#ffffff' }, // orange-700
  
  // Blue accent (from #00ADEF)
  { name: 'Blue on white', fg: '#00ADEF', bg: '#ffffff' },
  { name: 'Blue on dark', fg: '#00ADEF', bg: '#1e293b' },
  
  // Text colors
  { name: 'Dark text on white', fg: '#111827', bg: '#ffffff' }, // gray-900
  { name: 'Light text on dark', fg: '#f3f4f6', bg: '#020617' }, // gray-100 on slate-950
  { name: 'Gray text on white', fg: '#6b7280', bg: '#ffffff' }, // gray-500
  { name: 'Gray text on dark', fg: '#9ca3af', bg: '#1e293b' }, // gray-400 on slate-800
]

/**
 * Get accessible color alternatives
 */
export function getAccessibleAlternatives(baseColor: string, background: string): string[] {
  const alternatives: string[] = []
  const baseRgb = hexToRgb(baseColor)
  
  // Try darkening the color
  for (let factor = 0.9; factor >= 0.3; factor -= 0.1) {
    const darker = {
      r: Math.round(baseRgb.r * factor),
      g: Math.round(baseRgb.g * factor),
      b: Math.round(baseRgb.b * factor)
    }
    const hex = `#${darker.r.toString(16).padStart(2, '0')}${darker.g.toString(16).padStart(2, '0')}${darker.b.toString(16).padStart(2, '0')}`
    const contrast = checkContrast(hex, background)
    if (contrast.passes.normal) {
      alternatives.push(hex)
      break
    }
  }
  
  // Try lightening the color
  for (let factor = 1.1; factor <= 2.5; factor += 0.1) {
    const lighter = {
      r: Math.min(255, Math.round(baseRgb.r * factor)),
      g: Math.min(255, Math.round(baseRgb.g * factor)),
      b: Math.min(255, Math.round(baseRgb.b * factor))
    }
    const hex = `#${lighter.r.toString(16).padStart(2, '0')}${lighter.g.toString(16).padStart(2, '0')}${lighter.b.toString(16).padStart(2, '0')}`
    const contrast = checkContrast(hex, background)
    if (contrast.passes.normal) {
      alternatives.push(hex)
      break
    }
  }
  
  return alternatives
}

/**
 * Check all color combinations and generate report
 */
export function generateContrastReport(): string {
  let report = '# Relatório de Contraste de Cores\n\n'
  report += 'WCAG 2.1 Guidelines:\n'
  report += '- Texto normal: mínimo 4.5:1\n'
  report += '- Texto grande (18pt+ ou 14pt+ bold): mínimo 3:1\n'
  report += '- Componentes UI: mínimo 3:1\n\n'
  
  colorCombinations.forEach(combo => {
    const result = checkContrast(combo.fg, combo.bg)
    const status = result.passes.normal ? '✅' : result.passes.large ? '⚠️' : '❌'
    
    report += `## ${status} ${combo.name}\n`
    report += `- Foreground: ${combo.fg}\n`
    report += `- Background: ${combo.bg}\n`
    report += `- Ratio: ${result.ratio}:1\n`
    
    if (result.recommendation) {
      report += `- ⚠️ ${result.recommendation}\n`
      
      const alternatives = getAccessibleAlternatives(combo.fg, combo.bg)
      if (alternatives.length > 0) {
        report += `- 💡 Alternativas acessíveis: ${alternatives.join(', ')}\n`
      }
    }
    
    report += '\n'
  })
  
  return report
}