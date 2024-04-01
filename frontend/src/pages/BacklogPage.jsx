import React, {useState, useEffect} from 'react'
import userGameService from "@/services/userGameService";
import GameCardList from "@/components/GameCardList";
//TODO:
  // 1. Fetch the list of games from the backend
      // 1.1. Use the userGameRoutes.js to fetch the list of games
      // 1.2. Use the userGameController.js to fetch the list of games
      // 1.3. Use the Game model to fetch the list of games
  // 2. Display the list of games in a card format
 // 3. Add a button to remove a game from the backlog
  // 4. Add a button to mark a game as completed


  //FIXME:
  /*
  BacklogPage -> gameData
  Need to get Game documents from mongo,
    - Currently only getting the UserGame documentss
    -

  */
function BacklogPage() {  //
  const [backlog, setBacklog] = useState([])

//TODO: Consolidate the following useEffect for one type of userUpdate request, so that the userGameController can be updated to handle all userGame updates

  useEffect(() => {
    const fetchBacklog = async () => {
      try{
        let gameData = await userGameService.getUserBacklogWithGameDetails();
        console.log('BacklogPage -> gameData', gameData)
        setBacklog(gameData);
      }
      catch (error) {
        console.error('Error getting user backlog', error)
      }
    }

    fetchBacklog();
  }, [])



  return (
    <>
      <div>BacklogPage</div>

      {backlog && (
        <GameCardList games={backlog} />
      )}

    </>
  )
}

export default BacklogPage