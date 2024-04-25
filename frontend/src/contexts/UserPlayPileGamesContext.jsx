import {useState, useEffect, createContext} from 'react'
import userGameService from '@/services/userGameService'

const UserPlayPileGamesContext = createContext({});

export const UserPlayPileGamesProvider = ({children}) => {

  const [userPlayPileGames, setUserPlayPileGames] = useState([]);
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

  useEffect(() => {
    fetchUserPlayPileGames();
  }, [])

  return (
    <UserPlayPileGamesContext.Provider value={{userPlayPileGames, setUserPlayPileGames, loading, fetchUserPlayPileGames}}>
      {children}
    </UserPlayPileGamesContext.Provider>
  )
}

export default UserPlayPileGamesContext