import React, { useState, useEffect, useContext} from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from './Column';
import columnService from '@/services/columnService';
import { Button } from '@/components/ui/button';
import ColumnsContext from '@/contexts/ColumnsContext';

function Board({ columns, userGamesOnBoard }) {
  const { setColumnsOnBoard, fetchColumnsOnBoard } = useContext(ColumnsContext)

  const [isDroppableReady, setDroppableReady] = useState(false);


  const handleOnDragEnd = (result) => {
    // TODO: Handle the actual reordering logic here
    const { source, destination, type } = result;

    // check if user dragged card outside of board
    if(!destination) return;


    // if user places it back to the same spot
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }


    // Handle column drag
    if (type === 'column') {
      const newColumns = Array.from(columns);
      const [removed] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, removed);

      setColumnsOnBoard(newColumns);
      columnService.updatePositions(newColumns.map( column => ({_id: column._id}) ));


    }

  };


  useEffect(() => {
    // Use requestAnimationFrame to ensure Droppable is ready
    const handle = requestAnimationFrame(() => setDroppableReady(true));
    return () => cancelAnimationFrame(handle);
  }, []);


  if (!isDroppableReady) {
    return null; // or a loading indicator
  }

  return (
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId={`columnsBoard}`}  direction="horizontal" type="column">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
            >
              {columns.map((column, index) => (
                <Column
                  key={column._id}
                  id={column._id}
                  column={column}
                  games={userGamesOnBoard[column._id] || []}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

  );
}

export default Board;
