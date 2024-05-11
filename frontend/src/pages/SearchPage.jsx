import React, {useState, useEffect} from 'react'
import { useLocation} from 'react-router-dom'
import gameService from '../services/gameService'

import SearchResultsList from '../components/SearchResultsList'

//TODOS:
// Spinner icon

function SearchPage() {
  const [games, setGames] = useState(null);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchTerm = params.get('q');


   useEffect(() => {
    const fetchGames = async () => {
      try {
        let gameData = await gameService.searchIgdbGames(searchTerm);
        setGames(gameData);
        // if pagination is needed, add a 'next' button to fetch the next page of results
        // may have to use setGames([...games, ...response.data]);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    }
    fetchGames();
  }, [searchTerm])
  return (
        <>
        <h1>Results for: {searchTerm}</h1> {/*//FIXME causing undefined error */}
        <div className="flex flex-col items-center mt-12 ">

        <div className="max-w-5xl mx-6 rounded-2xl bg-gray-100/20 shadow-2xl backdrop-blur-sm backdrop-filter ">
          <SearchResultsList games={games} />
        </div>
      </div>
      </>
  )
}

export default SearchPage