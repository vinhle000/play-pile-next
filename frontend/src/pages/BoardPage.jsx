import React, {useState, useContext, useEffect} from 'react'
import userGameService from "@/services/userGameService";
import GameCardList from "@/components/GameCardList";
import UserPlayPileGamesContext from '@/contexts/UserPlayPileGamesContext'
import ColumnsContext from '@/contexts/ColumnsContext'
import Board from '@/components/Board'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';




// TODO: switch to more generic name "BoardPage"
function BoardPage() {  //

  const { userPlayPileGames, setUserPlayPileGames, fetchUserPlayPileGames, userPlayPileGamesLoading } = useContext(UserPlayPileGamesContext);
  const { userGamesOnBoard, setUserGamesOnBoard, fetchGamesOnBoard, userGamesOnBoardLoading } = useContext(UserPlayPileGamesContext);
  const { columns, setColumns, columnsLoading, fetchColumns } = useContext(ColumnsContext)

  const onBoardColumns = columns.filter((col) => col.isOnBoard)


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

  const [inputTitle, setInputTitle] = useState('');





  const handleCreateColumn = async () => {
    try {
      await columnService.createColumn(inputTitle);
      setInputTitle('');
    } catch (error) {
      console.error('Error creating column', error);
    }
  };





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
        <div>Board</div>
      <div className="flex">
        <Input
          type="text"
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
          placeholder="Column Title"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <Button onClick={handleCreateColumn}>Create +</Button>
      </div>

      <div className="mt-5">
        <Board columns={onBoardColumns} userGamesOnBoard={userGamesOnBoard}col/>

      </div>
    </>
  )
}

export default BoardPage;