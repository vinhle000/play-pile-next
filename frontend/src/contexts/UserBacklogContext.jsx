import React, {createContext, useState, useEffect } from 'react'
import userGameService from '@/services/userGameService';

const UserBacklogContext = createContext({});
export const UserBacklogProvider = ({children}) => {
  const [userBacklog, setUserBacklog] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchUserBacklog = async () => {
      try {
        setLoading(true);
        const response = await userGameService.getUserBacklogWithGameDetails();
        setUserBacklog(response);
        console.log('UserBacklogProvider -> fetchUserBacklog -> response', response);

      } catch (error) {
        console.error('Error fetching user backlog', error);
      } finally {
        setLoading(false)
      }
    }

   fetchUserBacklog();
  }, [])



  return (
    <UserBacklogContext.Provider  value={{ userBacklog, setUserBacklog, loading}}>
      {children}
    </UserBacklogContext.Provider>
  )
}

export default UserBacklogContext;