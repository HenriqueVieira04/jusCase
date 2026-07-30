import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '../../contexts/ThemeContext'
import SearchBar from './SearchBar'

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}

describe('SearchBar', () => {
  it('renderiza o input com placeholder', () => {
    renderWithTheme(<SearchBar />)
    expect(screen.getByPlaceholderText('Pesquisar...')).toBeInTheDocument()
  })

  it('exibe a lista de sugestões por padrão', () => {
    renderWithTheme(<SearchBar />)
    const list = screen.getByRole('list')
    expect(list).toBeInTheDocument()
    expect(screen.getByText('Ação Rescisória')).toBeInTheDocument()
    expect(screen.getByText('Ação Civil Pública')).toBeInTheDocument()
    expect(screen.getByText('Ação Popular')).toBeInTheDocument()
    expect(screen.getByText('Habeas Corpus')).toBeInTheDocument()
    expect(screen.getByText('Mandado de Segurança')).toBeInTheDocument()
  })

  it('atualiza o valor do input quando o usuário digita', () => {
    renderWithTheme(<SearchBar />)
    const input = screen.getByPlaceholderText('Pesquisar...')
    fireEvent.change(input, { target: { value: 'ação' } })
    expect(input).toHaveValue('ação')
  })

  it('destaca o termo buscado nas sugestões com <strong>', () => {
    renderWithTheme(<SearchBar />)
    const input = screen.getByPlaceholderText('Pesquisar...')
    fireEvent.change(input, { target: { value: 'ação' } })

    const items = screen.getAllByRole('listitem')
    // Toda sugestão que contenha "Ação" deve ter <strong>Ação</strong>
    const filteredItems = items.filter(
      (li) => li.textContent?.toLowerCase().includes('ação')
    )
    expect(filteredItems.length).toBeGreaterThan(0)
    filteredItems.forEach((li) => {
      expect(li.innerHTML).toContain('<strong class="font-bold">Ação</strong>')
    })
  })

  it('esconde a lista ao clicar em uma sugestão', () => {
    renderWithTheme(<SearchBar />)
    const item = screen.getByText('Ação Rescisória')
    fireEvent.click(item)
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('preenche o input com o texto da sugestão clicada', () => {
    renderWithTheme(<SearchBar />)
    const item = screen.getByText('Ação Rescisória')
    fireEvent.click(item)
    expect(screen.getByPlaceholderText('Pesquisar...')).toHaveValue(
      'Ação Rescisória'
    )
  })
})
