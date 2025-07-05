import { describe, it, expect } from '@jest/globals'
import { checkContrast, colorCombinations } from '@/lib/accessibility/contrast-checker'

describe('Accessibility - Color Contrast', () => {
  describe('WCAG Contrast Requirements', () => {
    it('should validate all predefined color combinations', () => {
      const failingCombinations: string[] = []
      
      colorCombinations.forEach(combo => {
        const result = checkContrast(combo.fg, combo.bg)
        
        // Check if meets at least large text requirement (3:1)
        if (!result.passes.large) {
          failingCombinations.push(
            `${combo.name}: ${result.ratio}:1 (Failed all WCAG requirements)`
          )
        } else if (!result.passes.normal) {
          console.warn(
            `${combo.name}: ${result.ratio}:1 (Only passes for large text)`
          )
        }
      })
      
      // All combinations should at least pass large text requirement
      expect(failingCombinations).toHaveLength(0)
    })

    it('should pass contrast for primary button colors', () => {
      const primaryButton = checkContrast('#c2410c', '#ffffff') // orange-700 on white
      expect(primaryButton.passes.normal).toBe(true)
      expect(primaryButton.ratio).toBeGreaterThanOrEqual(4.5)
    })

    it('should pass contrast for dark mode text', () => {
      const darkModeText = checkContrast('#f3f4f6', '#020617') // gray-100 on slate-950
      expect(darkModeText.passes.normal).toBe(true)
      expect(darkModeText.ratio).toBeGreaterThanOrEqual(4.5)
    })

    it('should pass contrast for error states', () => {
      const errorText = checkContrast('#dc2626', '#ffffff') // red-600 on white
      expect(errorText.passes.normal).toBe(true)
      expect(errorText.ratio).toBeGreaterThanOrEqual(4.5)
    })

    it('should pass contrast for success states', () => {
      const successText = checkContrast('#16a34a', '#ffffff') // green-600 on white
      expect(successText.passes.normal).toBe(true)
      expect(successText.ratio).toBeGreaterThanOrEqual(4.5)
    })

    it('should fail contrast for problematic blue', () => {
      const problematicBlue = checkContrast('#00ADEF', '#ffffff')
      expect(problematicBlue.passes.normal).toBe(false)
      expect(problematicBlue.recommendation).toBeDefined()
    })
  })

  describe('Contrast Calculation', () => {
    it('should calculate maximum contrast for black on white', () => {
      const maxContrast = checkContrast('#000000', '#ffffff')
      expect(maxContrast.ratio).toBeCloseTo(21, 0)
    })

    it('should calculate minimum contrast for same colors', () => {
      const minContrast = checkContrast('#ffffff', '#ffffff')
      expect(minContrast.ratio).toBeCloseTo(1, 0)
    })

    it('should handle hex colors with and without hash', () => {
      const withHash = checkContrast('#000000', '#ffffff')
      const withoutHash = checkContrast('000000', 'ffffff')
      expect(withHash.ratio).toBe(withoutHash.ratio)
    })
  })
})