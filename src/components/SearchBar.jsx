'use client';
import React, { useState } from 'react';
import {useRouter } from 'next/navigation';
// import SearchIcon from "./assets/SearchIcon";
import { MdOutlineManageSearch } from 'react-icons/md';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('searching...');
    router.push(`/games/search?q=${encodeURIComponent(searchTerm)}`);
  }

  return (

    <div className="flex flex-grow  w-80 h-10 rounded-3xl px-3.5 py-1" >
       <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <div className="absolute inset-y-0 left-2  flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>

          </div>
          <input
            id="search"
            name="search"
            className="block w-full rounded-md border-0  bg-gray-400/20  py-1.5 pl-10 pr-3 text-gray-300
             placeholder:text-black/50
             focus:bg-gray-100/40 focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
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