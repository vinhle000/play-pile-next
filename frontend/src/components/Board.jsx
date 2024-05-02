import React, { useState, useEffect, useContext} from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import Column from './Column';
import columnService from '@/services/columnService';
import userGameService from '@/services/userGameService'
import ColumnsContext from '@/contexts/ColumnsContext';
import UserPlayPileGamesContext from '@/contexts/UserPlayPileGamesContext';

function Board({ columns, userGamesOnBoard }) {
  const { setColumnsOnBoard, fetchColumnsOnBoard } = useContext(ColumnsContext);
  const { setUserGamesOnBoard, fetchUserGamesOnBoard } = useContext(UserPlayPileGamesContext);

  // FIXME: The games are not retaining their order in their respective columns after dropping
  const handleOnDragEnd = (result) => {
    const { source, destination, type } = result;
    console.log(`handleOnDragEnd ---> result `, {source, destination, type})

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

    // Handle game card drag
    if (type === 'card') {
      console.log( ' game card drop ------>>>> ' ,{userGamesOnBoard})
      const sourceColumnId = source.droppableId.split('-')[1]
      const destinationColumnId = destination.droppableId.split('-')[1]


      if (!userGamesOnBoard[destinationColumnId]) {
        userGamesOnBoard[destinationColumnId] = [];
      }

      const sourceList = [...userGamesOnBoard[sourceColumnId]]
      const destinationList =  userGamesOnBoard[destinationColumnId] ? [...userGamesOnBoard[destinationColumnId]] : []

      const [removed] = sourceList.splice(source.index, 1);

      console.log( ' game card to be re position ---> ', removed)
      console.log(` move from start: ${source.index}  ----> ${destination.index}`)

      destinationList.splice(destination.index, 0, removed);

      const newUserGamesOnBoard = {
        ...userGamesOnBoard,
        [sourceColumnId]: sourceList,
        [destinationColumnId]: destinationList,
      }

      // console.log( ' game card drop ------>>>> ' ,{userGamesOnBoard, newUserGamesOnBoard})
      // BUG: need to handle dragging card to a different position within in the same column



      setUserGamesOnBoard(newUserGamesOnBoard)
      const updatedColumnLists = {
        source: {
          columnId: sourceColumnId,
          userGames: sourceList,
        },
        destination: {
          columnId: destinationColumnId,
          userGames: destinationList,
        }
      };

      console.log(' updatedColumnLists ------> ', updatedColumnLists)
      userGameService.updateUserGameColumnPositions(updatedColumnLists);


    }

  };


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
                  games={ userGamesOnBoard[column._id]
                    ? userGamesOnBoard[column._id].sort((a, b) => a.columnPosition - b.columnPosition)
                    : []
                  }
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
