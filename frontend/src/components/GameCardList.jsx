import React from 'react'
import GameCard from './GameCard'

function GameCardList({games}) {
  return (
    <div>
    {/*list of games container*/}
        {/*sorting component by name, release date, rating, etc.*/}
        {/*filtering component by platform, genre, etc.*/}
        {/*pagination component*/}
        {/*game card component*/}
        {/*spinner icon*/}
      <ul>
        {games && (
          games.map(game =>
              <li key={game.igdbId}>
              <GameCard game={game} />
              </li>)
        )}

      </ul>
 </div>
  )
}

export default GameCardList