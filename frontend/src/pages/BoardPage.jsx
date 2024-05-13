import React, {useState, useContext, useEffect} from 'react'
import { TailSpin } from 'react-loader-spinner'
import columnService from '@/services/columnService'
import userGameService from "@/services/userGameService"

import Board from '@/components/Board'
import UserGameDataEditModal from '@/components/UserGameDataEditModal'
import ConfirmModal from '@/components/ConfirmModal'

import ColumnsContext from '@/contexts/ColumnsContext'
import UserPlayPileGamesContext from '@/contexts/UserPlayPileGamesContext'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';


function BoardPage() {  //

  const { userPlayPileGames, setUserPlayPileGames, fetchUserPlayPileGames, userPlayPileGamesLoading, updateUserGameData } = useContext(UserPlayPileGamesContext);
  const { userGamesOnBoard, setUserGamesOnBoard, fetchGamesOnBoard, userGamesOnBoardLoading } = useContext(UserPlayPileGamesContext);
  const { columnsOnBoard, setColumnsOnBoard, columnsOnBoardLoading, fetchColumnsOnBoard, deleteColumn } = useContext(ColumnsContext)


  const [openModal, setOpenModal] = useState('') // ['edit' ||'remove' || '']
  const [selectedGame, setSelectedGame] = useState(null)
  const [selectedColumn, setSelectedColumn] = useState(null) //
  const [inputTitle, setInputTitle] = useState('');



  /// FIXME: This is not working, making flexible method to open all types of modals setOpenModal('edit' || 'remove' || '')
  const handleOpenEditModal = (game) => {
    console.log('handleOpenEditModal -> game', game)
    setOpenModal('edit')
    setSelectedGame(game)
  }

  const handleRemoveGameConfirm = async () => {
    try {
      await updateUserGameData(selectedGame.igdbId,
        {
          isInPlayPile: "false",
          columnId: null,
          columnPosition: 0,
        })

    } catch (error) {
      console.error('Error removing game from pile', error)
    } finally {
      setOpenModal('')
    }
  }

  const handleDeleteColumn = async () => {


    // TODO: set  column related fields to default values for userGames items in this columns.
      // A) Use selectedColumn to and use endpoint to delete it using columnId

      // B) Use selectedColumnn to get list of games
          // userGamesList =  userGamesOnBoard[selectedColumn.id]
          // need create new API endpoint to update multiple games at once
          // Send list of gameIgdbIds as request body.

    //
    try {
      await deleteColumn(selectedColumn._id);
    } catch {
      console.error('Error deleting column', error);
    } finally {
      setOpenModal('');
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
    return <TailSpin color="black" radius="1rem"/>
  }

  return (
    <>
      <div className="mt-5">
        <Board
        columns={columnsOnBoard}
        userGamesOnBoard={userGamesOnBoard}
        setSelectedColumn={setSelectedColumn}
        setSelectedGame={setSelectedGame}
        setOpenModal={setOpenModal}
        />
      </div>

      {openModal === 'remove game' && (
        <ConfirmModal
          title="Remove Game"
          description="Are you sure you want to remove this game from your Play Pile?"
          onConfirm={ handleRemoveGameConfirm }
          onCancel={() => setOpenModal('')}
        />
      )}
     {openModal === 'delete column' && (
        <ConfirmModal
          title="Delete Column"
          description="Are you sure you want to delete this column? All games in this column will be still remain Play Pile."
          onConfirm={ handleDeleteColumn }
          onCancel={() => setOpenModal('')}
        />
      )}
    {openModal === 'edit' && (
      <UserGameDataEditModal
        game={selectedGame}
        openModal={openModal}
        setOpenModal={setOpenModal}

      />
    )}
    </>
  )
}

export default BoardPage;