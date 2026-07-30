import { type ReactNode } from "react"

function normalize(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

export default function highlightMatch(text: string, search: string): ReactNode {
    if (!search.trim()) return text

    const normalizedSearch = normalize(search)
    const normalizedText = normalize(text)
    const terms = normalizedSearch.split(/\s+/).filter(Boolean)

    // Only keep terms that actually appear somewhere in the suggestion
    const matchedTerms = terms.filter(term => normalizedText.includes(term))
    if (matchedTerms.length === 0) return text

    // Collect all [start, end] ranges for every occurrence of each matched term
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

    // Sort ranges and merge overlapping / adjacent ones
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

    // Build the final JSX from the original text using the merged ranges
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