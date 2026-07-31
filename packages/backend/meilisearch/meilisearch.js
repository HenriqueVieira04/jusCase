import { createRequire } from 'module'
import { fileURLToPath } from 'url'

// import da lib do meilisearch e de libs auxiliares para o index de assuntos
const require = createRequire(import.meta.url)
const { Meilisearch } = require('meilisearch')
const { readFileSync } = require('fs')
const { join, dirname } = require('path')

const __dirname = dirname(fileURLToPath(import.meta.url))

// variaveis de hospedagem e chave de acesso
const MEILI_HOST = process.env.MEILI_HOST || 'http://localhost:7700'
const MEILI_KEY  = process.env.MEILI_KEY  || 'qM83-WdQqSfdoM6-nOw2nyb8SvZs0v0SRNAl6728f-A'

// criação da instancia do client do meilisearch
const meili = new Meilisearch({ host: MEILI_HOST, apiKey: MEILI_KEY })

// função de checagem de estabilidade do meilisearch para iniciar o seed de dados
async function waitForMeili(maxRetries = 30, delayMs = 2000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await meili.health()
      console.log(`Meilisearch disponível (tentativa ${attempt})`)
      return
    } catch (err) {
      console.log(`Aguardando Meilisearch... (${attempt}/${maxRetries})`)
      if (attempt === maxRetries) throw err
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }
}

// função de seed de dados
async function seed() {
  await waitForMeili()

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
