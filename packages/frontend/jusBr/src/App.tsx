import SearchBar from './components/searchBar/SearchBar';
import { useTheme } from './contexts/useTheme'

// pagina da aplicação
function App() {
  const { isDarkMode, toggleDarkMode } = useTheme()
  const bgColor = isDarkMode ? "bg-gray-700" : "bg-gray-200";

  return (
    <div className={`${bgColor} w-full min-h-screen relative flex items-start justify-center px-4 pt-[12vh] sm:pt-[18vh] md:pt-[20vh]`}>
      <div className='w-full max-w-xl flex flex-col items-center gap-6 sm:gap-8'>
        <div className='w-full max-w-xs sm:max-w-sm md:max-w-md'>
          <img src="/logo.png" alt="logo" className='w-full h-auto object-contain' />
        </div>
        <SearchBar />
      </div>

      <button
        className={`w-10 h-10 rounded-full absolute bottom-4 sm:bottom-6 right-4 sm:right-6 flex items-center justify-center text-lg transition-colors hover:scale-110 active:scale-95 ${
          isDarkMode
            ? "bg-blue-400 hover:bg-blue-500 text-white"
            : "bg-gray-700 hover:bg-gray-600 text-white"
        }`}
        onClick={toggleDarkMode}
        aria-label="Alternar modo escuro"
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>
    </div>
  )
}

export default App
