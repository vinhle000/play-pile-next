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
(4) [{…}, {…}, {…}, {…}]
0
:
{_id: '660836e78770aa83a62a1cb7', userId: '66075d5aeef0a431b3a43497', igdbId: 5650, status: 'Plan to Play', isInBacklog: true, …}
1
:
createdAt
:
"2024-03-30T16:19:31.094Z"
igdbId
:
1715
isInBacklog
:
true
notes
:
"THIS IS A TEST"
status
:
"Plan to Play"
updatedAt
:
"2024-03-30T16:19:31.097Z"
userId
:
"66075d5aeef0a431b3a43497"
__v
:
0
_id
:
"66083b934764c75cbf649c0a"
[[Prototype]]
:
Object
2
:
{_id: '66083b944764c75cbf649c0f', userId: '66075d5aeef0a431b3a43497', igdbId: 119383, status: 'Plan to Play', isInBacklog: true, …}
3
:
{_id: '66083b954764c75cbf649c14', userId: '66075d5aeef0a431b3a43497', igdbId: 172595, status: 'Plan to Play', isInBacklog: true, …}
length
:
4
[[Prototype]]
:
Array(0)
  */
function BacklogPage() {
  const [backlog, setBacklog] = useState([])


  useEffect(() => {
    const fetchBacklog = async () => {
      try{
        let gameData = await userGameService.getUserBacklog();
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