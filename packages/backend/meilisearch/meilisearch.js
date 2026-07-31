import { createRequire } from 'module'
import { fileURLToPath } from 'url'

const require = createRequire(import.meta.url)
const { Meilisearch } = require('meilisearch')
const { readFileSync } = require('fs')
const { join, dirname } = require('path')

const __dirname = dirname(fileURLToPath(import.meta.url))

const MEILI_HOST = process.env.MEILI_HOST || 'http://localhost:7700'
const MEILI_KEY  = process.env.MEILI_KEY  || 'qM83-WdQqSfdoM6-nOw2nyb8SvZs0v0SRNAl6728f-A'

const meili = new Meilisearch({ host: MEILI_HOST, apiKey: MEILI_KEY })

async function seed() {
  const data = JSON.parse(
    readFileSync(join(__dirname, 'cnj_assuntos.json'), 'utf-8')
  )

  const index = meili.index('cnj_assuntos')

  // Configura atributos pesquisáveis
  await index.updateFilterableAttributes(['id'])
  await index.updateSearchableAttributes(['term'])
  await index.updateSortableAttributes(['term'])

  // Adiciona os documentos
  const result = await index.addDocuments(data)
  console.log(`${data.length} documentos indexados (taskUid: ${result.taskUid})`)
}

seed().catch(console.error)
