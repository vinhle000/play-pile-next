import React, {useContext} from 'react'
import GameCard from './GameCard'
import UserBacklogContext from '@/contexts/UserBacklogContext'
//TODO: Either create a specific component for the Search results gameCard,
// or create a condition to render the gameCard differently



function GameCardList({games}) {
  const {loading} = useContext(UserBacklogContext);


  if (loading) {
    return <h3>Loading...</h3>
  }

  return (
    <div className="mx-auto px-4 py-8 bg-gray-100 dark:bg-gray-800">
    {/* <div className="grid grid-cols-1 gap-6"> */}
      <div className="">
      {/*list of games container*/}
        {/*sorting component by name, release date, rating, etc.*/}
        {/*filtering component by platform, genre, etc.*/}
        {/*pagination component*/}
        {/*game card component*/}
        {/*spinner icon*/}
       {/* <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        */}
        <ul role="list" className="flex flex-wrap gap-4">
        {games && (
          games.map(game =>
             <GameCard key={game.igdbId} game={game} />

          ))
        }

        </ul>
      </div>
    </div>
  )
}

export default GameCardList