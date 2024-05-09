import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
// import SearchIcon from "./assets/SearchIcon";
import { MdOutlineManageSearch } from "react-icons/md";


function SearchBar() {

  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('searching...')
    navigate(`/games/search?q=${encodeURIComponent(searchTerm)}`);
  }

  return (

    <div className="flex flex-grow  w-96 h-10 rounded-3xl px-3.5 py-1" >
       <form onSubmit={handleSubmit} className="w-full max-w-lg lg:max-w-xs">
        <div className="relative">
          <div className="absolute inset-y-0 left-2  flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>

          </div>
          <input
            id="search"
            name="search"
            className="block w-full rounded-md border-0 bg-gray-100/30  py-1.5 pl-10 pr-3 text-gray-300
             placeholder:text-gray-400
             focus:bg-white focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
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