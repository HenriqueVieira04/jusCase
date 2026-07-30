import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import highlightMatch from './utils'

function renderHighlight(text: string, search: string) {
  const { container } = render(<div>{highlightMatch(text, search)}</div>)
  return container
}

describe('highlightMatch', () => {
  it('retorna o texto original se a busca for vazia', () => {
    const container = renderHighlight('Ação Rescisória', '')
    expect(container.innerHTML).toBe('<div>Ação Rescisória</div>')
  })

  it('retorna o texto original se nenhum termo existir na sugestão', () => {
    const container = renderHighlight('Habeas Corpus', 'Trabalhista')
    expect(container.innerHTML).toBe('<div>Habeas Corpus</div>')
  })

  it('destaca um termo simples (case-insensitive)', () => {
    const container = renderHighlight('Ação Rescisória', 'ação')
    expect(container.innerHTML).toBe(
      '<div><strong class="font-bold">Ação</strong> Rescisória</div>'
    )
  })

  it('destaca múltiplos termos separadamente', () => {
    const container = renderHighlight('Ação Civil Pública', 'ação civil')
    expect(container.innerHTML).toBe(
      '<div><strong class="font-bold">Ação</strong> <strong class="font-bold">Civil</strong> Pública</div>'
    )
  })

  it('ignora acentos na comparação mas mantém o texto original no destaque', () => {
    const container = renderHighlight('Ação Rescisória', 'rescisoria')
    expect(container.innerHTML).toBe(
      '<div>Ação <strong class="font-bold">Rescisória</strong></div>'
    )
  })

  it('destaca todas as ocorrências de um mesmo termo', () => {
    const container = renderHighlight('Pública Pública', 'publica')
    expect(container.innerHTML).toBe(
      '<div><strong class="font-bold">Pública</strong> <strong class="font-bold">Pública</strong></div>'
    )
  })

  it('trata busca com espaços extras', () => {
    const container = renderHighlight('Mandado de Segurança', '  mandado  ')
    expect(container.innerHTML).toBe(
      '<div><strong class="font-bold">Mandado</strong> de Segurança</div>'
    )
  })

  it('retorna texto original se search for só espaços', () => {
    const container = renderHighlight('Ação Rescisória', '   ')
    expect(container.innerHTML).toBe('<div>Ação Rescisória</div>')
  })
})
