import { type ReactNode } from "react"

// normalização de string para formato ascii minúsculo
function normalize(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

// destaca no texto original os termos da busca que aparecem na sugestão,
// comparando tudo sem acentos e em minúsculo, e devolvendo o jsx com
// )<strong>) envolvendo as partes correspondentes
export default function highlightMatch(text: string, search: string): ReactNode {
    if (!search.trim()) return text

    const normalizedSearch = normalize(search)
    const normalizedText = normalize(text)
    const terms = normalizedSearch.split(/\s+/).filter(Boolean)

    // mantém apenas os termos que realmente aparecem em algum lugar da sugestão
    const matchedTerms = terms.filter(term => normalizedText.includes(term))
    if (matchedTerms.length === 0) return text

    // coleta todos os intervalos de cada ocorrência de cada termo
    const ranges: Array<[number, number]> = []
    for (const term of matchedTerms) {
        let pos = 0
        while (true) {
            const idx = normalizedText.indexOf(term, pos)
            if (idx === -1) break
            ranges.push([idx, idx + term.length])
            pos = idx + term.length
        }
    }

    // ordena os intervalos e junta os sobrepostos ou adjacentes
    ranges.sort((a, b) => a[0] - b[0])
    const merged: Array<[number, number]> = []
    for (const range of ranges) {
        const last = merged[merged.length - 1]
        if (!last || range[0] > last[1]) {
            merged.push([...range])
        } else {
            last[1] = Math.max(last[1], range[1])
        }
    }

    // monta o jsx final a partir do texto original usando os intervalos juntados
    const result: ReactNode[] = []
    let cursor = 0
    for (const [start, end] of merged) {
        if (start > cursor) {
            result.push(text.slice(cursor, start))
        }
        result.push(
            <strong key={start} className="font-bold">
                {text.slice(start, end)}
            </strong>
        )
        cursor = end
    }
    if (cursor < text.length) {
        result.push(text.slice(cursor))
    }

    return result
}