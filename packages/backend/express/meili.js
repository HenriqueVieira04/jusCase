import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const { Meilisearch } = require('meilisearch')

const MEILI_HOST = process.env.MEILI_HOST || 'http://localhost:7700'
const MEILI_KEY  = process.env.MEILI_KEY  || 'qM83-WdQqSfdoM6-nOw2nyb8SvZs0v0SRNAl6728f-A'
const INDEX_NAME = 'cnj_assuntos'

const meiliClient = new Meilisearch({ host: MEILI_HOST, apiKey: MEILI_KEY })

export async function searchSugestoes(query, limit = 20) {
  if (!query.trim()) return []

  const result = await meiliClient.index(INDEX_NAME).search(query, { limit })
  return result.hits.map((hit) => ({
    id:   hit.id,
    term: hit.term,
  }))
}
