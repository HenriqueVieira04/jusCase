import { useState, type ReactNode } from 'react'
import { ThemeContext } from './themeContext'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setMode] = useState(false)

  const toggleDarkMode = () => setMode(prev => !prev)

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
