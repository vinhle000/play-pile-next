import React, {useState, useContext, useEffect} from 'react'
import userGameService from "@/services/userGameService";
import GameCardList from "@/components/GameCardList";
import UserPlayPileGamesContext from '@/contexts/UserPlayPileGamesContext'

// TODO: Refacroting to use the "UserPlayPileGamesGames"

// BUG: playPile games are not appearing on page
function PlayPileBoardPage() {  //

  const { UserPlayPileGames, setUserPlayPileGames, loading } = useContext(UserPlayPileGamesContext);


  useEffect(() => {
    userGameService.getUserPlayPileGames().then((response) => {
      setUserPlayPileGames(response)
    })
  }, [])

  if ( loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <h1>PlayPile Board</h1>
      {/* Side panel - PlayPile collection
          Shows games added by user,
          They can add the game to a column of their choice after clicking on the game
      */}
      <div>Sidebar</div>

      {!loading && (
        <GameCardList games={UserPlayPileGames} />
      )}

      {/* column items(<GameCard>)*/}
    </>
  )
}

export default PlayPileBoardPage;