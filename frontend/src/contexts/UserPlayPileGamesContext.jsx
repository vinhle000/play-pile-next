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
      fetchGamesOnBoard}}>
      {children}
    </UserPlayPileGamesContext.Provider>
  )
}

export default UserPlayPileGamesContext