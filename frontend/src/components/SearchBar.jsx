import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'


function SearchBar() {

  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('searching...')
    navigate(`/games/search?q=${encodeURIComponent(searchTerm)}`);
  }

  return (
    <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
      <form onSubmit={handleSubmit} className="w-full max-w-lg lg:max-w-xs">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9 2a7 7 0 016.993 7.817l3.727 3.727a1 1 0 11-1.414 1.414l-3.727-3.727A7 7 0 119 2zm0 2a5 5 0 100 10A5 5 0 009 4z"
              />
            </svg>
          </div>
          <input
            id="search"
            name="search"
            className="block w-full rounded-md border-0 bg-gray-700 py-1.5 pl-10 pr-3 text-gray-300 placeholder:text-gray-400 focus:bg-white focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="Search for games"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>



      </form>
    </div>
  )
}

export default SearchBar