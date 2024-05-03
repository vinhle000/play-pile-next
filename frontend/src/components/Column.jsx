import columnService from "@/services/columnService";
import { Draggable, Droppable } from 'react-beautiful-dnd';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import GameCard from './GameCard';
import { EllipsisHorizontalIcon} from '@heroicons/react/24/solid';

function Column({ id, column, games, index, handleOpenEditModal }) {


  // TODO: Implement safeguard modal to confirm column deletion
  const handleDeleteColumn = async () => {
    console.log('handleDeleteColumn -> id', id)
    try {
      await columnService.deleteColumn(id);
    } catch {
      console.error('Error deleting column', error);
    }
  }

  return (
    <Draggable draggableId={id.toString()} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="column-container"  // Add styling as needed
        >
          {/* Droppable area for game cards */}
          <Droppable droppableId={`column-${id}`} type="card">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`w-72  p-2 rounded-2xl shadow-sm ${
                  snapshot.isDraggingOver ? "bg-green-200" : "bg-gray-100"
                }`}
              >
               {/* Column Header */}
                <h2 className="column-title flex justify-between font-bold text-xl">
                  {column.title}

                  {/* Menu Button */}


                  <DropdownMenu>
                    <DropdownMenuTrigger
                       className={`text-current hover:bg-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                      <EllipsisHorizontalIcon className="h-8 w-8 fill-current"/>
                      </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onSelect={handleDeleteColumn} >Delete</DropdownMenuItem>
                      <DropdownMenuItem>Rename</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>



                </h2>
                {/* Game Cards */}
                {games.map((game, index) => (
                  <Draggable key={game._id.toString()} draggableId={`gameCard-${game._id}`} index={index}>
                    {(provided) => (
                      <GameCard
                        innerRef={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="game-card-container m-4"  // Add styling as needed
                        draggableProps={provided.draggableProps}
                        dragHandleProps={provided.dragHandleProps}
                        game={game}
                        handleOpenEditModal={handleOpenEditModal}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}

export default Column;