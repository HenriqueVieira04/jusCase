import { useState, useEffect, useRef, useCallback } from "react"
import { useTheme } from "../../contexts/useTheme"
import { fetchSugestoes } from "../../api/sugestoes"
import highlightMatch from "./utils"

export default function SearchBar(){
    const [sl, setSL] = useState(1)
    const [query, setQuery] = useState("")
    const [suggestions, setSuggestions] = useState<string[]>([])
    const { isDarkMode } = useTheme()
    const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

    // Busca sugestões com debounce: só dispara se query.trim() >= 4
    const handleChange = useCallback((value: string) => {
        setQuery(value)
        setSL(1)

        clearTimeout(debounceRef.current)

        const trimmed = value.trim()
        if (trimmed.length < 4) {
            setSuggestions([])
            return
        }

        debounceRef.current = setTimeout(async () => {
            const results = await fetchSugestoes(trimmed)
            setSuggestions(results)
        }, 250)
    }, [])

    // Cleanup do debounce ao desmontar
    useEffect(() => {
        return () => clearTimeout(debounceRef.current)
    }, [])

    const styleDiv = isDarkMode
        ? "bg-gray-800 shadow-lg shadow-black/50"
        : "bg-white shadow-lg shadow-zinc-500/50";
    const styleInput = isDarkMode
        ? "text-gray-100 caret-gray-100 placeholder-gray-400"
        : "text-gray-800 caret-gray-800 placeholder-gray-500";
    const styleSuggestion = isDarkMode
        ? "text-gray-300 hover:bg-gray-700"
        : "text-gray-700 hover:bg-gray-300";
    const borderComplete = sl > 0 && suggestions.length > 0 ? "rounded-t-3xl" : "rounded-3xl"

    return(
        <div className="w-full relative">
            <div className={`w-full h-12 sm:h-14 ${styleDiv} ${borderComplete}`}>
                <input
                    id="inputS"
                    className={`w-full h-full px-4 sm:px-6 outline-none ring-0 bg-transparent text-base sm:text-lg ${styleInput}`}
                    type="text"
                    placeholder="Pesquisar..."
                    value={query}
                    onChange={(e) => handleChange(e.target.value)}
                />
            </div>

            {sl > 0 && suggestions.length > 0 && (
                <ul className={`w-full mx-auto mt-px rounded-b-3xl overflow-hidden overflow-y-auto max-h-[40vh] ${isDarkMode ? "bg-gray-800/90 shadow-lg shadow-black/50" : "bg-gray-100 shadow-lg shadow-zinc-500/50"}`}>
                    {suggestions.map((sugestao, index) => (
                        <li
                            key={index}
                            className={`px-4 sm:px-6 py-2 sm:py-3 cursor-pointer text-sm sm:text-base ${styleSuggestion} transition-colors`}
                            onClick={() => {setQuery(sugestao); setSuggestions([]); setSL(0)}}
                        >
                            {highlightMatch(sugestao, query)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}