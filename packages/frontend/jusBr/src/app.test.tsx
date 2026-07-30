import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from './contexts/ThemeContext'
import App from './App'

function renderApp() {
  return render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  )
}

describe('App', () => {
  it('renderiza sem erros', () => {
    const { container } = renderApp()
    expect(container).toBeInTheDocument()
  })

  it('renderiza o SearchBar com placeholder', () => {
    renderApp()
    expect(screen.getByPlaceholderText('Pesquisar...')).toBeInTheDocument()
  })

  it('renderiza o botão de alternar modo escuro', () => {
    renderApp()
    const btn = screen.getByLabelText('Alternar modo escuro')
    expect(btn).toBeInTheDocument()
  })

  it('inicia com o ícone de lua (modo claro)', () => {
    renderApp()
    const btn = screen.getByLabelText('Alternar modo escuro')
    expect(btn.textContent).toBe('🌙')
  })

  it('alterna para modo escuro ao clicar no botão', () => {
    renderApp()
    const btn = screen.getByLabelText('Alternar modo escuro')
    fireEvent.click(btn)
    expect(btn.textContent).toBe('☀️')
  })

  it('volta para modo claro ao clicar duas vezes', () => {
    renderApp()
    const btn = screen.getByLabelText('Alternar modo escuro')
    fireEvent.click(btn)
    fireEvent.click(btn)
    expect(btn.textContent).toBe('🌙')
  })
})