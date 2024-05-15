import {useState, useEffect, useContext} from 'react'
import { useLocation} from 'react-router-dom'
import { TailSpin } from "react-loader-spinner"

import SearchResultsList from '@/components/SearchResultsList'
import ConfirmModal from '@/components/ConfirmModal'

import gameService from '../services/gameService'
import UserPlayPileGamesContext from '../contexts/UserPlayPileGamesContext'


function SearchPage() {
  const [games, setGames] = useState(null);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchTerm = params.get('q');

  const { userPlayPileGames, updateUserGameData, loading } = useContext(UserPlayPileGamesContext);
  const [selectedGame, setSelectedGame] = useState(null)
  const [openModal, setOpenModal] = useState('') // 'remove' || '']

  //Mapping by ID to find each userGame data, instead of scanning array
  let userPlayPileGamesByIgdbId = {};
  if (userPlayPileGames.length > 0) {
    userPlayPileGamesByIgdbId = userPlayPileGames.reduce((acc, game) => {
      acc[game.igdbId] = game;
      return acc;
    });
  }

  const handleRemoveGameFromPlayPile = async () => {
    try {
      await  updateUserGameData(selectedGame.igdbId, {isInPlayPile: false})
    } catch (error) {
      console.error('Error removing game from play pile', error)
    } finally {
      setOpenModal('')
    }
  }



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

    //FIXME: Loading spinner, will be added when memoizing the searched result games and userPlayPileGames
    // Currently rerendering the whole component
    // if (loading) { return <TailSpin color="black" radius="1rem"/> }
  return (
        <>

            <div className="flex flex-col items-center mt-12 ">

               <div className="max-w-5xl mx-6 rounded-2xl bg-gray-100/20 shadow-2xl backdrop-blur-sm backdrop-filter ">
                  <SearchResultsList
                    games={games}
                    userPlayPileGamesByIgdbId={userPlayPileGamesByIgdbId}
                    setSelectedGame={setSelectedGame}
                    setOpenModal={setOpenModal}
                    />
                </div>


          </div>




      {openModal === 'remove' &&
          <ConfirmModal
            title="Remove Game"
            description="This game will be removed from your play pile. But your data with game still remain. In case, you change your mind :) " //To permanetly delete?
            onConfirm={handleRemoveGameFromPlayPile}
            onCancel={()=> setOpenModal('')}
          />
        }
      </>
  )
}

export default SearchPage