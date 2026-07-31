import { describe, it, expect } from 'vitest'
import { typeDefs, resolvers } from '../server.js'

describe('Resolver: sugestoes', () => {
  
  it('retorna lista vazia se query for só espaços', async () => {
    const result = await resolvers.Query.sugestoes(null, { query: '   ' })
    expect(result).toEqual([])
  })
})
