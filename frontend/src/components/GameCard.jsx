import React from 'react'
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

function GameCard({game}) {


  const PlayStatusDropdown = (game) => {
    <div> Play Status</div>

  }

  const GenreList = () => {
    let genres = game.genres.map(genre =>
      <li key={genre.id}>{genre.name}</li>
    )
    return (
      <ul>
        {genres}
      </ul>
    )
  }
  const PlatformsList = () => {
    let platforms = game.platforms.map(platform =>
      <li key={platform.id}>{platform.name}</li>
    )
    return (
      <ul>
        {platforms}
      </ul>
    )
  }

  console.log('GameCard -> game', game)
  return (
    <div class="">
      <Card className="flex">

        <CardContent>
          <img src={game.cover[0].url} alt={game.name} className="h-56 object-cover" />

          {/* <p>Rating: {game.rating}</p> */}
          {/* <p>Initial Release Date: {game.releaseDate[0]['human']}</p> */}
          <PlatformsList />
          <div className="mt-3 justify-between items-center">
            <PlayStatusDropdown />
          {/* <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">Play</button> */}
          <button className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-700 transition-colors">Add To Backlog</button>
        </div>
        </CardContent>

        <CardHeader>
          <CardTitle>{game.name}</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
{/*
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter> */}
      </Card>
    </div>
  )
}

export default GameCard

