import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import userGameService from '@/services/userGameService';
import UserPlayPileGamesContext from '@/contexts/UserPlayPileGamesContext';
import ColumnsContext from '@/contexts/ColumnsContext';


import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"


const statuses = {
  Complete: 'text-green-700 bg-green-50 ring-green-600/20',
  Playing: 'text-gray-600 bg-gray-50 ring-gray-500/10',
  'Not playing': '',
  Abandoned: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
};

const platformsNames = {
  'Nintendo Entertainment System': 'NES',
  'Family Computer': 'Famicom',
  'Family Computer Disk System': 'Famicom Disk System',
  'Super Nintendo': 'SNES',
  'Super Nintendo Entertainment System': 'SNES',
  'Super Famicom': 'SNES (JP)',
  'Nintendo 64': 'N64',
  'Nintendo GameCube': 'GameCube',
  'Nintendo Switch': 'Switch',
};

function SearchResultsListItem({ game, userPlayPileGameData }) {

  const { loading, fetchUserPlayPileGames, updateUserGameData } = useContext(UserPlayPileGamesContext)
  const { columns, fetchColumns } = useContext(ColumnsContext);
  const [selectedColumnId, setSelectedColumnId ] = useState(userPlayPileGameData?.columnId  || null)
  const [userGameData, setUserGameData] = useState({
    ...userPlayPileGameData //FIXME: This is not one game
  });


  const updateUserGame = async (igdbId, updateData) => {
    updateData ? updateData : {};
    try {
      //FIXME: Only update the listItem as User edits the their relationship with the game
      let newData = await updateUserGameData(igdbId, {
        ...updateData,
      });
      if (updateData.columnId) {
        fetchUserPlayPileGames();
        setSelectedColumnId(updateData.columnId);

      }
      setUserGameData({ ...userGameData, ...newData });
    } catch (error) {
      console.error('Error updating UserGame Data ', error);
    }
  };

  return (
    <li className="flex items-center justify-between  bg-white/70 rounded-xl shadow-xl
                  transition-transform duration-300 ease-in-out hover:scale-105">
      <div className="flex gap-x-4">

        <div className="flex items-center">
          <Link to={'/games/' + game.igdbId}>
            <img
              src={game.cover.url}
              alt={game.name}
              className="max-h-48 object-cover rounded-tl-xl rounded-bl-xl" />
          </Link>
        </div>

        <div className="flex flex-col justify-between">

          <div className="flex justify-start h-1/5">
          <Link to={'/games/' + game.igdbId}>
            <p className="text-lg font-semibold text-black/80">
              {game.name}
            </p>
          </Link>

          </div>

          <div className="flex text-gray-500 text-xs">
            <p>Placeholder</p>
          </div>

          <div className="flex-col justify-between max-w-120">
            <div className="flex items-center  gap-x-2 text-xs leading-5 text-black/90">
              Released:
              <p className="whitespace-nowrap font-light">
                <time>
                  {new Date(game.firstReleaseDate).toLocaleDateString(
                    undefined,
                    { month: 'long', year: 'numeric' }
                  )}
                </time>
              </p>
            </div>

            <div className="flex flex-wrap justify-normal font-medium leading-5 ">
              <p className="flex items-center text-xs font-light">Genres: </p>
              {game.genres.map((genre) => (
                <div
                  key={genre.id}
                  className="rounded-md whitespace-nowrap m-1 px-2  text-xs ring-1 ring-inset"
                >
                  {genre.name}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-normal  leading-5 max-w-80">
              <p className="flex items-center text-xs"> Platforms: </p>
              {game.platforms.map((platform) => (
                <div
                  key={platform.id}
                  className="rounded-md whitespace-nowrap m-1 px-2 text-xs  ring-1 ring-inset"
                >
                  {platformsNames[platform.name]
                    ? platformsNames[platform.name]
                    : platform.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center ">
      <DropdownMenu className="flex justify-center items-center">
            <DropdownMenuTrigger >
              {userPlayPileGameData
                ?  <Button variant="secondary" className="" >Edit</Button>
                : <Button className="" >Add</Button>
              }
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto bg-zinc-100 drop-shadow-2xl">
              <DropdownMenuItem className="flex justify-center text-xs">Play Pile</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-300"/>

              <DropdownMenuRadioGroup value={selectedColumnId} onValueChange={(columnId) => {

                updateUserGame(game.igdbId, {
                  columnId: columnId,
                  isInPlayPile: true

                })
              }}>

                {columns && columns.map((column) => (
                  <DropdownMenuRadioItem
                  key={column._id}
                  value={column._id}
                  >
                    {column.title}
                  </DropdownMenuRadioItem>))
                }

              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>



      </div>
    </li>
  );
}

export default SearchResultsListItem;
