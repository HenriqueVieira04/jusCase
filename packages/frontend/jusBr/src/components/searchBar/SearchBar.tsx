import { useState } from "react"
import { useTheme } from "../../contexts/ThemeContext"

export default function SearchBar(){
    const [sl, setSL] = useState(1)
    const { isDarkMode } = useTheme()
    const [suggestions] = useState<string[]>([
        "Ação Rescisória",
        "Ação Civil Pública",
        "Ação Popular",
        "Habeas Corpus",
        "Mandado de Segurança",
    ])

    const styleDiv = isDarkMode ? 
    "bg-gray-800 shadow-lg shadow-black/50" : 
    "bg-white shadow-lg shadow shadow-zinc-500/50";
    const styleInput = isDarkMode ?
    "text-gray-100 caret-gray-100" :
    "text-gray-800 caret-gray-800";
    const styleSuggestion = isDarkMode ?
    "text-gray-300 hover:bg-gray-700" :
    "text-gray-700 hover:bg-gray-300";
    const borderComplete = sl > 0 ? "rounded-t-3xl" : "rounded-3xl"

    return(
        <div className={`w-full relative `}>
            <div className={`w-full h-md ${styleDiv} ${borderComplete}`}>
                <input
                    id="inputS"
                    className={`w-full h-full pt-2 pb-2 pr-8 pl-8 outline-none ring-0 bg-transparent ${styleInput}`}
                    type="text"
                />
            </div>

            {sl > 0 && (
                <ul className={`w-full mx-auto mt-px rounded-b-3xl overflow-hidden ${isDarkMode ? "bg-gray-800/90 shadow-lg shadow-black/50" : "bg-gray-100 shadow-lg shadow-zinc-500/50"}`}>
                    {suggestions.map((sugestao, index) => (
                        <li
                            key={index}
                            className={`px-8 py-2 cursor-pointer ${styleSuggestion} transition-colors`}
                            onClick={() => {document.querySelector<HTMLInputElement>("#inputS")!.value = sugestao; setSL(0)}}
                        >
                            {sugestao}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}