'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface UserPreferences {
  // Visual
  highContrast: boolean
  fontSize: 'small' | 'medium' | 'large'
  
  // Motion
  reducedMotion: boolean
  autoplayVideos: boolean
  
  // Interaction
  keyboardShortcuts: boolean
  confirmBeforeActions: boolean
  
  // Notifications
  soundAlerts: boolean
  visualAlerts: boolean
}

interface UserPreferencesContextType {
  preferences: UserPreferences
  updatePreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void
  resetPreferences: () => void
}

const defaultPreferences: UserPreferences = {
  highContrast: false,
  fontSize: 'medium',
  reducedMotion: false,
  autoplayVideos: true,
  keyboardShortcuts: true,
  confirmBeforeActions: false,
  soundAlerts: true,
  visualAlerts: true,
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined)

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)

  // Load preferences from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('userPreferences')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setPreferences({ ...defaultPreferences, ...parsed })
      } catch (error) {
        console.error('Error loading preferences:', error)
      }
    }

    // Check system preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches
    
    setPreferences(prev => ({
      ...prev,
      reducedMotion: prev.reducedMotion || prefersReducedMotion,
      highContrast: prev.highContrast || prefersHighContrast,
    }))
  }, [])

  // Apply preferences to document
  useEffect(() => {
    const root = document.documentElement

    // High contrast
    if (preferences.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    // Font size
    switch (preferences.fontSize) {
      case 'small':
        root.style.fontSize = '14px'
        break
      case 'large':
        root.style.fontSize = '18px'
        break
      default:
        root.style.fontSize = '16px'
    }

    // Reduced motion
    if (preferences.reducedMotion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }

    // Save to localStorage
    localStorage.setItem('userPreferences', JSON.stringify(preferences))
  }, [preferences])

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  const resetPreferences = () => {
    setPreferences(defaultPreferences)
    localStorage.removeItem('userPreferences')
  }

  return (
    <UserPreferencesContext.Provider value={{ preferences, updatePreference, resetPreferences }}>
      {children}
    </UserPreferencesContext.Provider>
  )
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext)
  if (!context) {
    throw new Error('useUserPreferences must be used within UserPreferencesProvider')
  }
  return context
}