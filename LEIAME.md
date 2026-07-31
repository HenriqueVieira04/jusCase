# JusBrasil — Guia Docker

## Apresentação

O case foi feito resolvendo o problema usando o Meilisearch (mecanismo de busca de código aberto) carregado com um index de busca de assuntos categorizados pelo CNJ (Conselho Nacional de Justiça). 

Alguns termos sugeridos para busca:
- crime
- ação
- sexual
- fraude
- furto
- roubo
- lei de

A stack do projeto tem react/vite no front comunicando-se via GraphQl com o backend feito em Express.js. O frontend é responsivo e possuí LightMode e DarkMode, atentando-se a seguir as restrições impostas pelo documento de requisitos.

__obs: tasks.md e history.md estão na pasta documentation__

## Pré-requisitos

- Docker 24+
- Docker Compose v2+

---



## Subir tudo

```bash
docker compose up --build -d
```

- `--build`  → reconstrói as imagens se houve mudanças no código
- `-d`       → modo detached (background)

### Verificar se está tudo rodando

```bash
docker compose ps
```

4 containers esperados: `jusbr-meilisearch`, `jusbr-seed`, `jusbr-backend`, `jusbr-frontend`.

### Portas

| Serviço | Host | Descrição |
|---|---|---|
| Meilisearch | `http://localhost:7700` | Motor de busca |
| GraphQL | `http://localhost:4001/graphql` | Apollo Sandbox |
| Frontend | `http://localhost:5178` | Vite dev server |

---

## Parar tudo

```bash
docker compose down
```

Para os containers mas **mantém** os volumes (dados do Meilisearch).

---

## Reiniciar tudo

```bash
docker compose restart
```

Reinicia todos os containers sem reconstruir imagens.

---

## Apagar tudo (containers + volumes + imagens)

```bash
docker compose down -v --rmi all
```

| Flag | Efeito |
|---|---|
| `-v` | Remove volumes (dados do Meilisearch também) |
| `--rmi all` | Remove as imagens locais |

---

## Ver logs de um serviço específico

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f meilisearch
```

---

## Reconstruir apenas um serviço

```bash
docker compose up --build -d backend
docker compose up --build -d frontend
```

---

## Acessar o shell do container

```bash
docker compose exec backend sh
docker compose exec frontend sh
```

---

## Árvore do projeto (Docker)

```
jusBrasil/
├── docker-compose.yml          ← orquestração dos 4 serviços
├── LEIAME.md                   ← este arquivo
├── packages/
│   ├── backend/
│   │   ├── express/
│   │   │   ├── Dockerfile      ← imagem do GraphQL (porta 4001)
│   │   │   ├── server.js
│   │   │   └── meili.js
│   │   └── meilisearch/
│   │       ├── meilisearch.js  ← seed script
│   │       ├── cnj_assuntos.json
│   │       └── run.sh          ← script local (sem Docker)
│   └── frontend/
│       └── jusBr/
│           └── Dockerfile      ← imagem do Vite (porta 5173)
```

---

## Fluxo de inicialização

```
1. meilisearch   → sobe na porta 7700
2. seed          → popula 3161 assuntos do CNJ e morre
3. backend       → Express + GraphQL na porta 4001
4. frontend      → Vite dev server na porta 5173
```

O `seed` executa uma vez e encerra. O `backend` e `frontend` ficam rodando.
