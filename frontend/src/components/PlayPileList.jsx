import {useState, useContext} from 'react'
import UserPlayPileGamesContext  from '@/contexts/UserPlayPileGamesContext'
import GameCardList from '@/components/GameCardList'


//TODO - add more lists besides "main" play pile list
function PlayPileList() {

  const {userPlayPileGames, loading} = useContext(UserPlayPileGamesContext);
  const [isOpen, setIsOpen] = useState(false);
  console.log('PlayPileList -> UserPlayPileGames', userPlayPileGames)
  return (
    <>
      <div className="flex grow flex-col gape-y-5 overflow-y-auto">
        <h2 className="text-2xl font-bold">Play Pile</h2>
        <GameCardList games={userPlayPileGames} loading={loading} />

      </div>

    </>
  )
}

export default PlayPileList