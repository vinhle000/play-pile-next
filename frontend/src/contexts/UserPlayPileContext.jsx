import {useState, useEffect, createContext} from 'react'
import userGameService from '@/services/userGameService'

const UserPlayPileContext = createContext({});

export const UserPlayPileProvider = ({children}) => {

  const [userPlayPile, setUserPlayPile] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserPlayPile = async () => {
    try {
      setLoading(true);
      const response = await userGameService.getUserPlayPile();
      setUserPlayPile(response);
    } catch (error) {
      console.error('Error fetching user play pile', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUserPlayPile();
  }, [])

  return (
    <UserPlayPileContext.Provider value={{userPlayPile, setUserPlayPile, loading, fetchUserPlayPile}}>
      {children}
    </UserPlayPileContext.Provider>
  )
}

export default UserPlayPileContext