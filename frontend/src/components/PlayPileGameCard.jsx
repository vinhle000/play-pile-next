import { useState, useContext } from 'react';
import ConfirmModal from '@/components/ConfirmModal';
import userGameService from '@/services/userGameService';
import UserPlayPileGamesContext  from '@/contexts/UserPlayPileGamesContext'
import ColumnsContext from '@/contexts/ColumnsContext';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"


function PlayPileGameCard({game}) {
  const { columns, fetchColumns, loading } = useContext(ColumnsContext);
  const { userPlayPileGame, updateUserGameData, fetchUserPlayPileGames} = useContext(UserPlayPileGamesContext)
  // const [assignedColumnId, setAssignedColumnId ] = useState(game.columnId || null)


  const handleAssignGameToColumn = async (columnId) => {
    event.preventDefault();
    console.log(' handleAssignGameToColumn -> ecolumnId', columnId)
      try {
        await userGameService.updateUserGameData(game.igdbId, {columnId: columnId})
      } catch (error) {
        console.error('Error assigning game to column', {error})
      } finally {
        fetchUserPlayPileGames();
        // setIsPopoverOpen(false)

      }

    }
  return (

    <div key={game.igdbId} className=" group rounded-xl m-2 drop-shadow-lg ">
      <DropdownMenu>
        <DropdownMenuTrigger>
            <img
              src={game.gameInfo.coverUrl}
              alt={game.gameInfo.name}
              className="rounded-xl max-w-32"
            />
            <div
              onClick={() => setSelectedGame(game)}
              className="absolute inset-0  flex items-center
                          justify-center  opacity-0 group-hover:opacity-100
                          transition-opacity duration-300
                          bg-black bg-opacity-70 rounded-lg
                          "
            >
              <p className="text-white text-xl font-bold">{game.gameInfo.name}</p>
            </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-zinc-200 drop-shadow-2xl">
          <DropdownMenuLabel>In List</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-300"/>
          <DropdownMenuRadioGroup
            value={game.columnId}
            onValueChange={handleAssignGameToColumn}
          >
          {columns.map((column) => {
            return (
              <DropdownMenuRadioItem
                key={column._id}
                value={column._id}
                // checked={game.columnId === column._id}
                // onSelect={handleAssignGameToColumn}
              >
                {column.title}
              </DropdownMenuRadioItem>
            )
          })}

          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
  )
}

export default PlayPileGameCard