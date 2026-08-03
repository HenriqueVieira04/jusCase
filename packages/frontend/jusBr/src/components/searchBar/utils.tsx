import { type ReactNode } from "react"

// normalização de string para formato ascii minúsculo
function normalize(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

// destaca na sugestão de autocomplete o conteúdo referente ao que está inserido no
// input fazendo a comparação sem considerar diferenciação de acentos ou caixa da escrita,
// retornando um jsx com <strong> envolvendo as partes correspondentes
export default function highlightMatch(text: string, search: string): ReactNode {
    const trimmed = search.trim()
    if (!trimmed) return text

    const normalizedText = normalize(text)
    const normalizedSearch = normalize(trimmed)

    //só destaca se a busca estiver contida a partir do início da sugestão
    if (!normalizedText.startsWith(normalizedSearch)) return text

    const prefix = text.slice(0, trimmed.length)
    const rest = text.slice(trimmed.length)

    return (
        <>
            <strong className="font-bold">{prefix}</strong>
            {rest}
        </>
    )
}