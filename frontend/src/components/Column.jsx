import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import GameCard from './GameCard';

function Column({ id, column, games, index }) {
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
                className={`game-list p-2 rounded-2xl shadow-sm ${
                  snapshot.isDraggingOver ? "bg-green-200" : "bg-gray-100"
                }`}
              >
               {/* Column Header */}
                <h2 className="column-title flex justify-between font-bold text-xl">
                  {column.title}
                  <span className="text-grey-500 bg-gray-200 rounded-full p-2 text-sm font-normal">
                    {games.length}
                  </span>
                </h2>
                {/* Game Cards */}
                {games.map((game, index) => (
                  <Draggable key={game._id.toString()} draggableId={game._id.toString()} index={index}>
                    {(provided) => (
                      <GameCard
                        innerRef={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="game-card-container m-4"  // Add styling as needed
                        draggableProps={provided.draggableProps}
                        dragHandleProps={provided.dragHandleProps}
                        game={game}
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