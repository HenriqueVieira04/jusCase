import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { ThemeProvider } from './ThemeContext'
import { useTheme } from './useTheme'

describe('ThemeContext', () => {
  it('inicia com isDarkMode = false', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    })
    expect(result.current.isDarkMode).toBe(false)
  })

  it('toggleDarkMode inverte isDarkMode para true', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    })
    act(() => result.current.toggleDarkMode())
    expect(result.current.isDarkMode).toBe(true)
  })

  it('toggleDarkMode inverte isDarkMode de volta para false após dois toggles', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    })
    act(() => result.current.toggleDarkMode())
    act(() => result.current.toggleDarkMode())
    expect(result.current.isDarkMode).toBe(false)
  })

  it('useTheme lança erro se usado fora do ThemeProvider', () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      'useTheme must be used within a ThemeProvider'
    )
  })
})
