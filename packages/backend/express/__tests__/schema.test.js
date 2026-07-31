import { describe, it, expect } from 'vitest'
import { typeDefs } from '../server.js'
import { buildSchema } from 'graphql'

describe('Schema GraphQL', () => {
  it('compila sem erros', () => {
    expect(() => buildSchema(typeDefs)).not.toThrow()
  })

  it('define o tipo Sugestao com id e term', () => {
    const schema = buildSchema(typeDefs)
    const sugestaoType = schema.getType('Sugestao')
    expect(sugestaoType).toBeDefined()
    const fields = sugestaoType.getFields()
    expect(fields.id).toBeDefined()
    expect(fields.term).toBeDefined()
  })

  it('define a query sugestoes com argumento query', () => {
    const schema = buildSchema(typeDefs)
    const queryType = schema.getQueryType()
    const field = queryType.getFields().sugestoes
    expect(field).toBeDefined()
    expect(field.args[0].name).toBe('query')
    expect(field.args[0].type.toString()).toContain('String')
  })
})
