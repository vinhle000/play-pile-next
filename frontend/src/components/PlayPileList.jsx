import {useState, useContext} from 'react'
import UserPlayPileGamesContext  from '@/contexts/UserPlayPileGamesContext'

//TODO - add more lists besides "main" play pile list
function PlayPileList() {

  const {UserPlayPileGames} = useContext(UserPlayPileGamesContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex grow flex-col gape-y-5 overflow-y-auto bg-gray-900 px-6">

      </div>

    </>
  )
}

export default PlayPileList