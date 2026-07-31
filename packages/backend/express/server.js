import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import express from 'express'
import cors from 'cors'
import { searchSugestoes } from './meili.js'

// ── GraphQL Schema ───────────────────────────────────────────
export const typeDefs = `#graphql
  type Sugestao {
    id:    ID!
    term:  String!
  }

  type Query {
    """Retorna sugestões do Meilisearch baseadas no termo de busca."""
    sugestoes(query: String!): [Sugestao!]!
  }
`

// ── Resolvers ────────────────────────────────────────────────
export const resolvers = {
  Query: {
    sugestoes: async (_parent, { query }) => {
      if (!query.trim()) return []
      try {
        return await searchSugestoes(query)
      } catch (error) {
        console.error('Erro ao buscar sugestões:', error)
        return []
      }
    },
  },
}

// ── App factory (usada pelo server.js e pelos testes) ───────
export async function createApp() {
  const app = express()
  const apollo = new ApolloServer({ typeDefs, resolvers })

  await apollo.start()
  app.use('/graphql', cors(), express.json(), expressMiddleware(apollo))
  return app
}

// ── Server (só executa quando chamado diretamente, não nos testes) ──
async function startServer() {
  const app = await createApp()
  const PORT = process.env.PORT || 4000
  const server = app.listen(PORT, () => {
    console.log(`Servidor GraphQL rodando em http://localhost:${PORT}/graphql`)
  })
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Porta ${PORT} já está em uso. Use PORT=4001 node server.js`)
    } else {
      console.error(err)
    }
    process.exit(1)
  })
}

const isMainModule = process.argv[1] && (
  process.argv[1] === import.meta.filename ||
  process.argv[1].endsWith('/server.js')
)

if (isMainModule) {
  startServer()
}
