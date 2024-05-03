import React, {useState, useContext} from 'react'
import GameCard from './GameCard'
import UserPlayPileGamesContext from '@/contexts/UserPlayPileGamesContext'
import ConfirmModal from '@/components/ConfirmModal'
import UserGameDataEditModal from '@/components/UserGameDataEditModal'
import userGameService from '@/services/userGameService'
//TODO: Either create a specific component for the Search results gameCard,
// or create a condition to render the gameCard differently



function GameCardList({games}) {
  const {loading, fetchUserPlayPileGames} = useContext(UserPlayPileGamesContext);
  const [modalState, setModalState] = useState('') // ['edit', 'remove'
  const [editGame, setEditGame] = useState({})

  if (loading) {
    return <h3>Loading...</h3>
  }

  const handleOpenEditModal = (game) => {
    setModalState('edit')
    setEditGame(game)
  }

  const handleRemoveConfirm = async () => {
    console.log('handleRemoveConfirm -> editGame', editGame)
    try {
      await userGameService.updateUserGameData(editGame.igdbId, {isInPlayPile: "false"})
      setModalState('');
      fetchUserPlayPileGames(); //refresh the play pile games
    } catch (error) {
      console.log('handleRemoveConfirm -> error', error)
    }

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
             <GameCard
              key={game.igdbId}
              game={game}
              handleOpenEditModal={handleOpenEditModal}
              setModalState={setModalState}
             />

          ))
        }
        </ul>

        {modalState === 'remove' && (
          <ConfirmModal
            title="Remove Game"
            description="Are you sure you want to remove this game from your Play Pile?"
            onConfirm={ handleRemoveConfirm }
            onCancel={() => setModalState('')}
          />
        )}


        {modalState === 'edit' && (
          <UserGameDataEditModal
            game={editGame}
            modalState={modalState}
            setModalState={setModalState}
          />
        )}

      </div>
    </div>
  )
}

export default GameCardList