import { useState } from "react"
import { useTheme } from "../../contexts/ThemeContext"
import highlightMatch from "./utils"

export default function SearchBar(){
    const [sl, setSL] = useState(1)
    const [query, setQuery] = useState("")
    const { isDarkMode } = useTheme()
    const [suggestions] = useState<string[]>([
        "Ação Rescisória",
        "Ação Civil Pública",
        "Ação Popular",
        "Habeas Corpus",
        "Mandado de Segurança",
    ])

    const styleDiv = isDarkMode
        ? "bg-gray-800 shadow-lg shadow-black/50"
        : "bg-white shadow-lg shadow-zinc-500/50";
    const styleInput = isDarkMode
        ? "text-gray-100 caret-gray-100 placeholder-gray-400"
        : "text-gray-800 caret-gray-800 placeholder-gray-500";
    const styleSuggestion = isDarkMode
        ? "text-gray-300 hover:bg-gray-700"
        : "text-gray-700 hover:bg-gray-300";
    const borderComplete = sl > 0 ? "rounded-t-3xl" : "rounded-3xl"

    return(
        <div className="w-full relative">
            <div className={`w-full h-12 sm:h-14 ${styleDiv} ${borderComplete}`}>
                <input
                    id="inputS"
                    className={`w-full h-full px-4 sm:px-6 outline-none ring-0 bg-transparent text-base sm:text-lg ${styleInput}`}
                    type="text"
                    placeholder="Pesquisar..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {sl > 0 && (
                <ul className={`w-full mx-auto mt-px rounded-b-3xl overflow-hidden ${isDarkMode ? "bg-gray-800/90 shadow-lg shadow-black/50" : "bg-gray-100 shadow-lg shadow-zinc-500/50"}`}>
                    {suggestions.map((sugestao, index) => (
                        <li
                            key={index}
                            className={`px-4 sm:px-6 py-2 sm:py-3 cursor-pointer text-sm sm:text-base ${styleSuggestion} transition-colors`}
                            onClick={() => {setQuery(sugestao); setSL(0)}}
                        >
                            {highlightMatch(sugestao, query)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}