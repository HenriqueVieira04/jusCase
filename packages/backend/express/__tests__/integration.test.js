import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import request from 'supertest'

// Mock do módulo meili.js para não depender do Meilisearch real na hora de rodar os testes
vi.mock('../meili.js', () => ({
  searchSugestoes: vi.fn(),
}))

import { searchSugestoes } from '../meili.js'
import { createApp } from '../server.js'

const mockedSearch = vi.mocked(searchSugestoes)

let app

beforeAll(async () => {
  app = await createApp()
})

afterAll(() => {
  vi.restoreAllMocks()
})


describe('POST /graphql - integração', () => {
  //teste de retorno postivo de query vazia, com resultado vazio
  it('retorna 200 e sugestoes vazias para query vazia', async () => {
    const res = await request(app)
      .post('/graphql')
      .send({ query: '{ sugestoes(query: "") { id term } }' })

    expect(res.status).toBe(200)
    expect(res.body.data.sugestoes).toEqual([])
  })

  // teste de retorno de query vaálida com valor "ação"
  it('retorna sugestoes mockadas para query válida', async () => {
    mockedSearch.mockResolvedValue([
      { id: 'cnj_353', term: 'Ação Penal' },
      { id: 'cnj_354', term: 'Ação Penal Militar' },
    ])

    const res = await request(app)
      .post('/graphql')
      .send({ query: '{ sugestoes(query: "ação") { id term } }' })

    expect(res.status).toBe(200)
    expect(res.body.data.sugestoes).toHaveLength(2)
    expect(res.body.data.sugestoes[0]).toEqual({
      id: 'cnj_353',
      term: 'Ação Penal',
    })
    expect(mockedSearch).toHaveBeenCalledWith('ação')
  })

  // teste de query inválida
  it('retorna 400 para query GraphQL inválida', async () => {
    const res = await request(app)
      .post('/graphql')
      .send({ query: '{ invalidQuery }' })

    expect(res.status).toBe(400)
  })

  // teste de bloqueio de get do apollo server
  it('retorna 400 para GET (Apollo não expõe GET por padrão)', async () => {
    const res = await request(app).get('/graphql')
    expect(res.status).toBe(400)
  })
})
