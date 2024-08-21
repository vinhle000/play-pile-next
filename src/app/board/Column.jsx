'use client';
import { useState } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import ConfirmModal from '@/components/ConfirmModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import GameCard from '@/components/GameCard';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid';

function Column({
  id,
  column,
  games,
  index,
  setSelectedColumn,
  setSelectedGame,
  setOpenModal,
}) {
  //FIXME: backdrop-blur causing issues with the cards being dragged over appears behind the column
  // And drag and drop is not as smooth as it should be
  return (
    <Draggable draggableId={id.toString()} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="column-container" // Add styling as needed
        >
          {/* Droppable area for game cards */}
          <Droppable droppableId={`column-${id}`} type="card">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`w-100 p-2 space-y-2  bg-gray-100/20 -z-20 rounded-2xl shadow-sm
                backdrop-filter
                }`}
              >
                {/* Column Header */}
                <h2 className="flex justify-between font-bold text-lg  text-black/60 p-x-5">
                  {column.title}

                  {/* Menu Button */}

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={`text-current hover:bg-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                      <EllipsisHorizontalIcon className="h-8 w-8 fill-current" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onSelect={() => {
                          setSelectedColumn(column);
                          setOpenModal('delete column');
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem>Rename</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </h2>
                {/* Game Cards */}
                {games.map((game, index) => (
                  <Draggable
                    key={game._id.toString()}
                    draggableId={`gameCard-${game._id}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <GameCard
                        innerRef={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="game-card-container" // Add styling as needed
                        draggableProps={provided.draggableProps}
                        dragHandleProps={provided.dragHandleProps}
                        snapshot={snapshot}
                        game={game}
                        setSelectedGame={setSelectedGame}
                        setOpenModal={setOpenModal}
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
