import React, {useState, useContext, useEffect} from 'react'
import columnService from '@/services/columnService'
import userGameService from "@/services/userGameService";

import Board from '@/components/Board'
import GameCardList from "@/components/GameCardList";
import UserGameDataEditModal from '@/components/UserGameDataEditModal'
import ConfirmModal from '@/components/ConfirmModal'

import ColumnsContext from '@/contexts/ColumnsContext'
import UserPlayPileGamesContext from '@/contexts/UserPlayPileGamesContext'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';



// TODO: switch to more generic name "BoardPage"
function BoardPage() {  //

  const { userPlayPileGames, setUserPlayPileGames, fetchUserPlayPileGames, userPlayPileGamesLoading } = useContext(UserPlayPileGamesContext);
  const { userGamesOnBoard, setUserGamesOnBoard, fetchGamesOnBoard, userGamesOnBoardLoading } = useContext(UserPlayPileGamesContext);
  const { columnsOnBoard, setColumnsOnBoard, columnsOnBoardLoading, fetchColumnsOnBoard } = useContext(ColumnsContext)


  const [modalState, setModalState] = useState('') // ['edit' ||'remove' || '']
  const [editGame, setEditGame] = useState({})
  const [inputTitle, setInputTitle] = useState('');


  const handleOpenEditModal = (event, game) => {
    console.log('handleOpenEditModal -> game', game)
    setModalState('edit')
    setEditGame(game)
  }

  const handleRemoveConfirm = async () => {
    try {
      await userGameService.updateUserGameData(editGame.igdbId,
        {
          isInPlayPile: "false",
          columnId: null,
          columnPosition: 0,
        })

        // FIXME
        // fetchGamesOnBoard()?
        // we need handle each edit to the gamec ards to not have to rerender every card in teh column again
        // Memoize?
    } catch (error) {
      console.error('Error removing game from pile', error)
    }
    setModalState('')
  }

  const handleRemoveColumnConfirm = async () => {
    try {
      await columnService.delete(columnId)
    } catch (error) {
      console.error('Error removing game from pile', error)
    }
    setModalState('')
  }





  //REVISE: this is for testing only, going to assign all games to the first column
  const assignGamesToColumnsToFirstColumn = () => {
    console.log('Assigning games to columns --- FOR INITIAL TESTING', {userPlayPileGames})
    try {
      const columnId = columnsOnBoard[0]._id
      userPlayPileGames.forEach(async (game) => {
        await userGameService.updateUserGameData(game.igdbId, { columnId: columnId })
      })
    } catch (error) {
      console.error('Error assigning games to columns', error)
    }
  }




  useEffect(() => {
    try {
      fetchUserPlayPileGames();
      fetchGamesOnBoard();
      fetchColumnsOnBoard();

    } catch (error) {
      console.error('Error fetching columns and user games by column ids: ', error)
    }
  }, [])

  if ( userGamesOnBoardLoading || columnsOnBoardLoading) {
    return <div>Loading...</div>
  }

  return (
    <>

      <div className="mt-5">
        <Board columns={columnsOnBoard} userGamesOnBoard={userGamesOnBoard} handleOpenEditModal={handleOpenEditModal}/>
      </div>
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
        handleRemoveConfirm
      />
    )}
    </>
  )
}

export default BoardPage;