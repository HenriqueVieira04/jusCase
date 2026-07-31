import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from '../../contexts/ThemeContext'
import SearchBar from './SearchBar'

// Mock do módulo do meili para não depender do Meilisearch real na hora de rodar os testes
vi.mock('../../api/sugestoes', () => ({
  fetchSugestoes: vi.fn(),
}))


import { fetchSugestoes } from '../../api/sugestoes'
const fetchSugestoesMock = vi.mocked(fetchSugestoes)

// função de render de um elemento qualquer
function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}

describe('SearchBar', () => {
  // Reseta o estado do mock entre um teste e outro
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza o input com placeholder', () => {
    renderWithTheme(<SearchBar />)
    expect(screen.getByPlaceholderText('Pesquisar...')).toBeInTheDocument()
  })

  it('não exibe lista de sugestões se não há resultados', () => {
    renderWithTheme(<SearchBar />)
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('atualiza o valor do input quando o usuário digita', () => {
    renderWithTheme(<SearchBar />)
    const input = screen.getByPlaceholderText('Pesquisar...')
    fireEvent.change(input, { target: { value: 'ação' } })
    expect(input).toHaveValue('ação')
  })

  it('não faz fetch se query tiver menos de 4 caracteres efetivos', async () => {
    renderWithTheme(<SearchBar />)
    const input = screen.getByPlaceholderText('Pesquisar...')
    fireEvent.change(input, { target: { value: 'abc' } })

    await waitFor(() => {
      expect(fetchSugestoesMock).not.toHaveBeenCalled()
    })
  })

  it('faz fetch se query tiver 4 ou mais caracteres', async () => {
    // Programa a resposta do mock
    fetchSugestoesMock.mockResolvedValue(['Ação Penal'])

    renderWithTheme(<SearchBar />)
    const input = screen.getByPlaceholderText('Pesquisar...')
    fireEvent.change(input, { target: { value: 'ação penal' } })

    // Verifica se a função mockada foi chamada com o argumento certo
    await waitFor(() => {
      expect(fetchSugestoesMock).toHaveBeenCalledWith('ação penal')
    })
  })

  it('exibe sugestões retornadas pelo backend', async () => {
    fetchSugestoesMock.mockResolvedValue([
      'Ação Penal',
      'Ação Popular',
    ])

    renderWithTheme(<SearchBar />)
    const input = screen.getByPlaceholderText('Pesquisar...')
    fireEvent.change(input, { target: { value: 'ação' } })

    // O waitFor = debounce + retorno da promise
    await waitFor(() => {
      const items = screen.getAllByRole('listitem')
      expect(items).toHaveLength(2)
      expect(items[0].textContent).toBe('Ação Penal')
      expect(items[1].textContent).toBe('Ação Popular')
    })
  })

  it('aplica highlight nos termos buscados nas sugestões', async () => {
    fetchSugestoesMock.mockResolvedValue(['Ação Penal'])

    renderWithTheme(<SearchBar />)
    const input = screen.getByPlaceholderText('Pesquisar...')
    fireEvent.change(input, { target: { value: 'ação' } })

    await waitFor(() => {
      const items = screen.getAllByRole('listitem')
      expect(items).toHaveLength(1)
      // O highlight quebra o texto em partes: "Ação" fica dentro de <strong>
      expect(items[0].innerHTML).toContain(
        '<strong class="font-bold">Ação</strong>'
      )
    })
  })

  it('preenche o input e esconde a lista ao clicar em uma sugestão', async () => {
    fetchSugestoesMock.mockResolvedValue(['Ação Penal'])

    renderWithTheme(<SearchBar />)
    const input = screen.getByPlaceholderText('Pesquisar...')
    fireEvent.change(input, { target: { value: 'ação' } })

    await waitFor(() => {
      expect(screen.getAllByRole('listitem')).toHaveLength(1)
    })

    // Clica na sugestão
    fireEvent.click(screen.getAllByRole('listitem')[0])

    expect(input).toHaveValue('Ação Penal')
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })
})
