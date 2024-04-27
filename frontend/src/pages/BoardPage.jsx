import React, {useState, useContext, useEffect} from 'react'
import userGameService from "@/services/userGameService";
import GameCardList from "@/components/GameCardList";
import UserPlayPileGamesContext from '@/contexts/UserPlayPileGamesContext'
import ColumnsContext from '@/contexts/ColumnsContext'
import Board from '@/components/Board'

// TODO: switch to more generic name "BoardPage"
function BoardPage() {  //

  const { UserPlayPileGames, setUserPlayPileGames, userPlayPileGamesLoading } = useContext(UserPlayPileGamesContext);
  const { columns, setColumns, columnsLoading, fetchColumns } = useContext(ColumnsContext)

  const onBoardColumns = columns.filter((col) => col.isOnBoard)
  // get board Colium play pile games, get the columnID

  const columnIds = onBoardColumns.map((col) => col._id )
  console.log({columnIds})
  useEffect(() => {
    userGameService.getUserPlayPileGames().then((response) => {
      setUserPlayPileGames(response)
    })
  }, [])

  if ( userPlayPileGamesLoading || columnsLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <h1>PlayPile Board</h1>
      <Board columns={onBoardColumns} />
    </>
  )
}

export default BoardPage;