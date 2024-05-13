import {useState, useEffect, createContext} from 'react'
import userGameService from '@/services/userGameService'

const UserPlayPileGamesContext = createContext({});

export const UserPlayPileGamesProvider = ({children}) => {

  const [userPlayPileGames, setUserPlayPileGames] = useState([]);
  const [userGamesOnBoard, setUserGamesOnBoard] = useState({});
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


  const updateUserGameData = async (gameIgdbId, updateData) => {
    try {
      setLoading(true);
      await userGameService.updateUserGameData(gameIgdbId, updateData)
      fetchGamesOnBoard(); //NOTE: possible improvement to not have to fetch all games again using Memoization custom hook
    } catch (error) {
      console.error('Error updating userGame columnId ', error)
    } finally {
      setLoading(false);
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