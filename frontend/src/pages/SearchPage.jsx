import React, {useState, useEffect} from 'react'
import { useLocation} from 'react-router-dom'
import gameService from '../services/gameService'
import GameCard from '../components/GameCard'
import GameCardsList from '../components/GameCardList'


//TODOS:
// Spinner icon

function SearchPage() {
  const [games, setGames] = useState(null);
  const location = useLocation();
  console.log('SearchPage -> location', location)
  //{pathname: '/games/search', search: '?q=fasdf', hash: '', state: null, key: 'f0edybvp'}
  // const queryParams = new URLSearchParams(location.q);
  const searchTerm = location['search'].split('=')[1];

  console.log('SearchPage -> searchTerm', searchTerm)



  useEffect(() => {
    const fetchGames = async () => {
      try {
        let gameData = await gameService.searchIgdbGames(searchTerm);
        console.log('RESPONSE from search', gameData);
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
    <div >
      <h1>Search Results for: {searchTerm}</h1>
      <br />
      <br />
      <br />
      <br />
      <GameCardsList games={games} />

    </div>
  )
}

export default SearchPage