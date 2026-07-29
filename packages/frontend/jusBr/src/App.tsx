import './App.css'
import SearchBar from './components/searchBar/SearchBar';
import { useTheme } from './contexts/ThemeContext'

function App() {
  const { isDarkMode, toggleDarkMode } = useTheme()
  const bgColor = isDarkMode ? "bg-gray-700" : "bg-gray-200";

  return (
    <div className={`${bgColor} w-full h-full relative flex items-start justify-center pt-[25vh]`}>
      <div className='w-2xl h-[20vh] flex flex-col justify-around'>
        <div className='w-full h-[65%]'>
          <img src="../public/logo.png" alt="logo" />
        </div>
        <SearchBar />        
      </div>      
      <button
        className={`w-10 h-10 rounded-full absolute bottom-6 right-6 ${isDarkMode ? "bg-blue-300" : "bg-gray-700"}`}
        onClick={toggleDarkMode}
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>
    </div>
  )
}

export default App
