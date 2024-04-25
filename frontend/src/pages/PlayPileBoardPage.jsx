import React, {useState, useContext, useEffect} from 'react'
import userGameService from "@/services/userGameService";
import GameCardList from "@/components/GameCardList";
import UserPlayPileContext from '@/contexts/UserPlayPileContext'

// TODO: Refacroting to use the "UserPlayPileGames"

// BUG: playPile games are not appearing on page
function PlayPileBoardPage() {  //

  const { userPlayPile, setUserPlayPile, loading } = useContext(UserPlayPileContext);


  useEffect(() => {
    userGameService.getUserPlayPile().then((response) => {
      setUserPlayPile(response)
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
        <GameCardList games={userPlayPile} />
      )}

      {/* column items(<GameCard>)*/}
    </>
  )
}

export default PlayPileBoardPage;