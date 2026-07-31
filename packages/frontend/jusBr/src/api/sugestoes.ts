// API de busca ao graphQL

const GRAPHQL_URL = 'http://localhost:4001/graphql'

interface SugestaoRaw {
  id: string
  term: string
}

export async function fetchSugestoes(query: string): Promise<string[]> {
  try {
    const res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query Sugestoes($query: String!) {
            sugestoes(query: $query) {
              id
              term
            }
          }
        `,
        variables: { query },
      }),
    })

    if (!res.ok) return []

    const json = await res.json()
    const sugestoes: SugestaoRaw[] = json?.data?.sugestoes ?? []
    return sugestoes.map((s) => s.term)
  } catch {
    return []
  }
}
