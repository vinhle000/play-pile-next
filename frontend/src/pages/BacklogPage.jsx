import React, {useState, useContext, useEffect} from 'react'
import userGameService from "@/services/userGameService";
import GameCardList from "@/components/GameCardList";
import UserBacklogContext from '@/contexts/UserBacklogContext'

//TODO:
// [] Add a dropdown menu,  to mark a game as completed, playing, or backlog



function BacklogPage() {  //
  // const [backlog, setBacklog] = useState([])
  const { userBacklog, setUserBacklog, loading } = useContext(UserBacklogContext);


  console.log('BacklogPage -> userBacklog', userBacklog)


  useEffect(() => {
    userGameService.getUserBacklogWithGameDetails().then((response) => {
      setUserBacklog(response)
    })
  }, [])


  if ( loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div>BacklogPage</div>

      {!loading && (
        <GameCardList games={userBacklog} />
      )}

    </>
  )
}

export default BacklogPage