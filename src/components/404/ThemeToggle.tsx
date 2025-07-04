'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
      document.documentElement.classList.toggle('light', savedTheme === 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('light', !newTheme);
    
    // Track theme change
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'theme_change', {
        event_category: 'engagement',
        event_label: newTheme ? 'dark' : 'light'
      });
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-3 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-full hover:bg-gray-700 transition-all duration-200 group z-50"
      aria-label="Alternar tema"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-400 group-hover:rotate-180 transition-transform duration-500" />
      ) : (
        <Moon className="w-5 h-5 text-blue-400 group-hover:rotate-12 transition-transform duration-500" />
      )}
    </button>
  );
}