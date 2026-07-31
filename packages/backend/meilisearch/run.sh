#!/bin/bash
# ─────────────────────────────────────────────────────────────
# run.sh — Sobe todo o backend (Meilisearch + Express)
#
# Uso:   cd packages/backend && bash meilisearch/run.sh
# Portas: Meilisearch:7700   Express:4001 (GraphQL)
# ─────────────────────────────────────────────────────────────
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
MEILI_BIN="$SCRIPT_DIR/meilisearch"
MEILI_DATA="$SCRIPT_DIR/data.ms"
CNJ_FILE="$SCRIPT_DIR/cnj_assuntos.json"
SEED_JS="$SCRIPT_DIR/meilisearch.js"
EXPRESS_DIR="$SCRIPT_DIR/../express"
MASTER_KEY="qM83-WdQqSfdoM6-nOw2nyb8SvZs0v0SRNAl6728f-A"

cleanup() {
  echo ""
  echo "Encerrando Meilisearch..."
  kill $MEILI_PID 2>/dev/null || true
  echo "Backend finalizado."
}
trap cleanup EXIT INT TERM

# ── Etapa 1: Meilisearch ────────────────────────────────────
echo "Iniciando Meilisearch..."
"$MEILI_BIN" \
  --master-key "$MASTER_KEY" \
  --db-path "$MEILI_DATA" \
  > /dev/null 2>&1 &
MEILI_PID=$!

# Aguarda Meilisearch estar pronto
echo -n "   Aguardando Meilisearch "
for i in $(seq 1 20); do
  if curl -s http://localhost:7700/health > /dev/null 2>&1; then
    echo " ✓"
    break
  fi
  echo -n "."
  sleep 1
done

# ── Etapa 2: Popular dados CNJ ──────────────────────────────
echo "📦 Populando dados CNJ (3161 registros)..."
curl -s -X POST 'http://localhost:7700/indexes/cnj_assuntos/documents' \
  -H "Authorization: Bearer $MASTER_KEY" \
  -H 'Content-Type: application/json' \
  --data-binary @"$CNJ_FILE" > /dev/null

sleep 1
curl -s -X PATCH 'http://localhost:7700/indexes/cnj_assuntos/settings' \
  -H "Authorization: Bearer $MASTER_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"searchableAttributes":["term"]}' > /dev/null

echo "   Meilisearch na porta 7700"

# ── Etapa 3: Express + GraphQL ──────────────────────────────
echo "Iniciando servidor na porta 4001..."
cd "$EXPRESS_DIR"
MEILI_KEY="$MASTER_KEY" PORT=4001 node server.js &
EXPRESS_PID=$!

sleep 2
echo ""
echo "══════════════════════════════════════════════════════════"
echo "Meilisearch : http://localhost:7700"
echo "GraphQL     : http://localhost:4001/graphql"
echo "══════════════════════════════════════════════════════════"
echo ""
echo "Pressione Ctrl+C para encerrar..."

wait $EXPRESS_PID 2>/dev/null
