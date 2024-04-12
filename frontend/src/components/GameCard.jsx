import React, {useContext, useState, memo} from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import userGameService from "@/services/userGameService"
import UserBacklogContext from '@/contexts/UserBacklogContext'
import useUserGameData from '@/hooks/useUserGameData'
import LogRocket from 'logrocket';

function GameCard ({ game }) {
  const { userBacklog, setUserBacklog, loading} = useContext(UserBacklogContext);
  const [ userGameData, setUserGameData ] = useUserGameData({
    status: game.status,
    isInBacklog: game.isInBacklog,
  })

  const PlayStatusDropdown = (game) => {
    <div> Play Status</div>
  }

  const GenreList = () => {
    let genres = game?.genres.map(genre =>
      <li key={genre.id}>{genre.name}</li>
    )
    return (
      <ul>
        {genres}
      </ul>
    )
  }
  const PlatformsList = () => {
    let platforms = game?.platforms.map(platform =>
      <li key={platform.id}>{platform.name}</li>
    )
    return (
      <ul>
        {platforms}
      </ul>
    )
  }


  const updateUserGameData = async (igdbId, updateData) => {
    updateData ? updateData : {}
    try {
      //NOTE: Only rerenders the GameCard component in the list that has the updated changes
      // Utilizing useUserGameData hook to manage the state of the game data
      // with the use of React.useMemo and React.useCallback
     let newData = await userGameService.updateUserGameData(igdbId, {...updateData})

     setUserGameData({...userGameData, ...newData})
     console.log('GameCard -> updateBacklog -> newData', newData)
      // LogRocket.log('userGameData updated successfully', newData);

    } catch (error) {
      console.error('Error updating UserGame Data ', error)
      LogRocket.error('Error updating UserGame Data ', error);
    }
  }

  //TODO: Add a loading spinner
  // Create a condition to render the card if its the backlog page, rerender list/gameDco the game is removed...
  // Other condition, as isSearchItem,
  //isSearchItem ? renderAs search format:
  //renderAs normal format(BacklogPage)
  // Includes hovering over the card to show minimal overlay options to edit some of the userGameData
  // Such as PlaysStatus and AddtoBacklog || RemoveFromBacklog


  return (
    <div className="">
      <Card className="flex">
        <CardContent>
          {game.cover?.length &&
            <img src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover[0].image_id}.jpg`} alt={game.name} className="h-56 object-cover" />
          }
          {/* <p>Rating: {game.rating}</p> */}
          {/* <p>Initial Release Date: {game.releaseDate[0]['human']}</p> */}
          {/* <PlatformsList /> */}
          <div className="mt-3 justify-between items-center">
            <PlayStatusDropdown />

          <div>
            {(userGameData.isInBacklog ? (
              <button onClick={(e) => updateUserGameData(game.igdbId, {isInBacklog: false})} className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-700 transition-colors">Remove</button>
            ) : (
              <button onClick={(e) => updateUserGameData(game.igdbId, {isInBacklog: true})} className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-700 transition-colors">Add To Backlog</button>
            ))}
          </div>

        </div>
        </CardContent>

        <CardHeader>
          <CardTitle>{game.name}</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        {   /*
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter> */}
      </Card>
    </div>
  )
}

export default GameCard

