import {useState, useEffect, createContext} from 'react'
import userGameService from '@/services/userGameService'

const UserPlayPileGamesContext = createContext({});

export const UserPlayPileGamesProvider = ({children}) => {

  const [userPlayPileGames, setUserPlayPileGames] = useState([]);
  const [userGamesOnBoard, setUserGamesOnBoard] = useState({});
      // map of columnId to games
        // {columnId: [game1, game2, game3]}
  const [loading, setLoading] = useState(true);

  const fetchUserPlayPileGames = async () => {
    try {
      setLoading(true);
      const response = await userGameService.getUserPlayPileGames();
      setUserPlayPileGames(response);
    } catch (error) {
      console.error('Error fetching user play pile', error);
    } finally {
      setLoading(false);
    }
  }

  const fetchGamesOnBoard = async () => {
    try {
      setLoading(true);
      const gamesOnBoard = await userGameService.getUserGamesOnBoard();
      //map of columnId to games
      // {columnId: [game1, game2, game3]}
      // FIXME: this is for testing only, going to assign a
      if (!gamesOnBoard) {
        setUserGamesOnBoard({});
        return;
      }
      setUserGamesOnBoard(gamesOnBoard);

    } catch (error) {
      console.error('Error fetching user play pile', error);
    } finally {
      setLoading(false);
    }
  }


  //BUG this is this is wrong, we are  setting the columnId as the field, this was for the drag n drop, but we need it as a general updated
  const updateUserGameData = async (gameIgdbId, updateData) => {
    try {
      setLoading(true);
      await userGameService.updateUserGameData(gameIgdbId, updateData)

    } catch (error) {
      console.error('Error updating userGame columnId ', error)
    }
  }

  const updateUserGameColumnPositions = async (updatedColumnUserGames) => {
    try {
      setLoading(true);
      await userGameService.updateUserGameColumnPositions(updatedColumnUserGames)
    } catch (error) {
      console.error('Error updating userGame columnId ', error)
    }
  }

  useEffect(() => {
    fetchUserPlayPileGames();
    fetchGamesOnBoard();
  }, [])

  return (
    <UserPlayPileGamesContext.Provider value={{
      loading,
      userPlayPileGames,
      setUserPlayPileGames,
      fetchUserPlayPileGames,
      userGamesOnBoard,
      setUserGamesOnBoard,
      fetchGamesOnBoard,
      updateUserGameData,
      updateUserGameColumnPositions,
    }}
      >
      {children}
    </UserPlayPileGamesContext.Provider>
  )
}

export default UserPlayPileGamesContext