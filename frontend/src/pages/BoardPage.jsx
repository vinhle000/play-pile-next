import React, {useState, useContext, useEffect} from 'react'
import userGameService from "@/services/userGameService";
import GameCardList from "@/components/GameCardList";
import UserPlayPileGamesContext from '@/contexts/UserPlayPileGamesContext'
import ColumnsContext from '@/contexts/ColumnsContext'
import Board from '@/components/Board'
import { Button } from '@/components/ui/button'

// TODO: switch to more generic name "BoardPage"
function BoardPage() {  //

  const { userPlayPileGames, setUserPlayPileGames, fetchUserPlayPileGames, userPlayPileGamesLoading } = useContext(UserPlayPileGamesContext);
  const { userGamesOnBoard, setUserGamesOnBoard, fetchGamesOnBoard, userGamesOnBoardLoading } = useContext(UserPlayPileGamesContext);
  const { columns, setColumns, columnsLoading, fetchColumns } = useContext(ColumnsContext)

  const onBoardColumns = columns.filter((col) => col.isOnBoard)
  //REMOVE this is now done in the backend
  // const columnIds = onBoardColumns.map((col) => col._id )


  //REVISE: this is for testing only, going to assign all games to the first column
  const assignGamesToColumnsToFirstColumn = () => {
    console.log('Assigning games to columns --- FOR INITIAL TESTING', {userPlayPileGames})
    try {
      const columnId = columns[0]._id
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
      fetchColumns()
      fetchGamesOnBoard()

    } catch (error) {
      console.error('Error fetching columns and user games by column ids: ', error)
    }
  }, [])

  if ( userGamesOnBoardLoading || columnsLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <h1>PlayPile Board</h1>
      <Button onClick={() => assignGamesToColumnsToFirstColumn(userGamesOnBoard)}>
          Assign Games to First Column, for testing
        </Button>


      <Board columns={onBoardColumns} userGamesOnBoard={userGamesOnBoard}col/>
    </>
  )
}

export default BoardPage;