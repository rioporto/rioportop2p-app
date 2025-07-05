import { useUserPreferences } from '@/contexts/UserPreferencesContext'

interface AnimationConfig {
  duration?: number
  delay?: number
  ease?: string
  scale?: number
  opacity?: number
  x?: number
  y?: number
  rotate?: number
}

/**
 * Hook to handle animations based on user preferences
 * Returns animation config or null if reduced motion is enabled
 */
export function useAnimation(config: AnimationConfig): AnimationConfig | null {
  const { preferences } = useUserPreferences()

  if (preferences.reducedMotion) {
    // Return null or minimal animation for reduced motion
    return null
  }

  return config
}

/**
 * Hook to get animation variants for Framer Motion
 * Automatically handles reduced motion preference
 */
export function useAnimationVariants(variants: any) {
  const { preferences } = useUserPreferences()

  if (preferences.reducedMotion) {
    // Return static variants (no animation)
    return {
      initial: variants.animate || {},
      animate: variants.animate || {},
      exit: variants.animate || {},
    }
  }

  return variants
}

/**
 * Hook to get transition config
 * Returns instant transition if reduced motion is enabled
 */
export function useTransition(transition: any = {}) {
  const { preferences } = useUserPreferences()

  if (preferences.reducedMotion) {
    return {
      duration: 0.01,
      delay: 0,
    }
  }

  return transition
}

/**
 * CSS transition utility based on preferences
 */
export function useTransitionClass(baseClass: string = ''): string {
  const { preferences } = useUserPreferences()

  if (preferences.reducedMotion) {
    return `${baseClass} transition-none`
  }

  return `${baseClass} transition-all duration-300 ease-in-out`
}