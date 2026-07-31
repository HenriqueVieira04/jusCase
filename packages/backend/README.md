# Backend — JusBrasil

## Estrutura de diretórios

```
packages/backend/
│
├── express/                     # Servidor GraphQL (Express + Apollo)
│   ├── server.js                # Código do servidor
│   ├── package.json             # Dependências (express, apollo, meilisearch, graphql)
│   └── node_modules/
│
└── meilisearch/                 # Motor de busca + dados
    ├── meilisearch              # Binário do Meilisearch v1.51.0
    ├── meilisearch.js           # Script de seed (popula o índice)
    ├── cnj_assuntos.json        # 3161 assuntos do CNJ em formato plano
    ├── run.sh                   # Script unificado para subir tudo
    ├── package.json             # Dependências para o seed (meilisearch)
    └── node_modules/
```

---

## Como rodar

### Com um comando (recomendado)

```bash
cd packages/backend && bash meilisearch/run.sh
```

Isso sobe o **Meilisearch** (porta 7700), popula os dados CNJ automaticamente e inicia o **Express + GraphQL** (porta 4001).

### Manualmente (passo a passo)

```bash
# Terminal 1: Meilisearch
cd packages/backend/meilisearch
./meilisearch --master-key "qM83-WdQqSfdoM6-nOw2nyb8SvZs0v0SRNAl6728f-A"

# Terminal 2: Seed (popula os dados)
cd packages/backend/meilisearch
node meilisearch.js

# Terminal 3: Express + GraphQL
cd packages/backend/express
PORT=4001 node server.js
```

---

## Decisões de arquitetura — prós e contras

### 1. GraphQL em vez de REST

| Prós | Contras |
|---|---|
| O frontend pede exatamente os campos que precisa (`{ id, term }`) | Overhead do Apollo Server (~1MB extra) |
| Schema tipado — o Apollo Sandbox autodocumenta a API | Curva de aprendizado maior para quem só conhece REST |
| Fácil de evoluir: adicionar campo novo não quebra consumidores | Debug no browser é menos direto que `curl` em REST |

A query que o frontend vai usar:

```graphql
query Sugestoes($query: String!) {
  sugestoes(query: $query) {
    id
    term
  }
}
```

### 2. Meilisearch em vez de Elasticsearch/Postgres FTS

| Prós | Contras |
|---|---|
| Binário único de ~132MB, sem infra adicional | Menos maduro que Elasticsearch |
| Tolerante a typos por padrão (fuzzy search) | Menos funcionalidades de agregação |
| API REST nativa, fácil de integrar | Comunidade menor |
| Extremamente rápido (respostas em <5ms) | — |

### 3. Express em vez de NestJS/Fastify

| Prós | Contras |
|---|---|
| Mínimo boilerplate (~60 linhas o server.js) | Sem injeção de dependência nativa |
| Ecossistema enorme de middlewares | Estrutura de projeto manual (não opinativo) |
| Apollo Server tem integração oficial (`expressMiddleware`) | — |

### 4. Seed via `curl` em vez de Node.js no `run.sh`

| Prós | Contras |
|---|---|
| Não depende de `node_modules` instalados para iniciar | Duas abordagens diferentes (curl vs JS) |
| Idempotente: pode rodar várias vezes sem quebrar | — |
| Evita `ECONNREFUSED` do sandbox do VS Code | — |

### 5. Porta 4001 em vez de 4000

| Prós | Contras |
|---|---|
| Evita conflito com processos zumbis do sandbox | Porta não-padrão |
| `4000` é comum em outras ferramentas (debuggers, etc.) | — |

### 6. `meilisearch` como binário local (não Docker)

| Prós | Contras |
|---|---|
| Zero dependência de Docker instalado | Ocupa 132MB no repositório |
| Inicia em <1 segundo | Não isola o processo |
| Ideal para desenvolvimento local | Em produção, será Docker mesmo |

### 7. Apollo Server v4 (não v5)

| Prós | Contras |
|---|---|
| Mais documentação e exemplos disponíveis | Deprecated — EOL em Jan/2026 |
| Compatível com Express 4 (estável) | Será necessário migrar para v5 futuramente |
| `expressMiddleware` testado e estável | — |

### 8. `meilisearch.js` usa `createRequire` (CommonJS dentro de ESM)

| Prós | Contras |
|---|---|
| O pacote `meilisearch` v0.60 exporta como CJS, não ESM puro | Código híbrido, menos elegante |
| Evita ter que configurar bundler só pro seed | Não afeta runtime (só script de seed) |

---

## Fluxo de dados completo

```
┌──────────────┐     GraphQL      ┌─────────────┐    REST    ┌──────────────┐
│   Frontend   │ ───────────────→ │   Express    │ ────────→ │  Meilisearch │
│   (React)    │ ←─────────────── │   :4001      │ ←──────── │  :7700       │
└──────────────┘   JSON response  └─────────────┘   hits    └──────────────┘
                                         │
                                         │ search(query, { limit: 10 })
                                         ▼
                                  ┌──────────────┐
                                  │  cnj_assuntos │
                                  │  3161 docs    │
                                  └──────────────┘
```

1. Usuário digita no `SearchBar` → `highlightMatch` processa localmente
2. Frontend envia query GraphQL → `POST /graphql { sugestoes(query: "...") }`
3. Express chama `meili.index('cnj_assuntos').search(query)`
4. Meilisearch retorna hits ranqueados por relevância (fuzzy match)
5. Frontend renderiza sugestões com highlight nos termos correspondentes

---

## Variáveis de ambiente suportadas

| Variável | Padrão | Descrição |
|---|---|---|
| `MEILI_HOST` | `http://localhost:7700` | Endereço do Meilisearch |
| `MEILI_KEY` | (master key hardcoded) | Chave de API do Meilisearch |
| `PORT` | `4001` | Porta do servidor Express |

---

## Próximos passos (quando for para Docker)

```dockerfile
# Dockerfile sugerido (não implementado ainda)
FROM node:24-alpine
COPY express/ /app/express/
COPY meilisearch/meilisearch /app/meilisearch/
COPY meilisearch/cnj_assuntos.json /app/meilisearch/
# ... entrypoint sobe Meilisearch + Express
```
