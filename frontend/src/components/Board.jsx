import React, { useState, useEffect, useContext} from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import Column from './Column';
import ColumnForm from './ColumnForm';

import columnService from '@/services/columnService';
import userGameService from '@/services/userGameService'

import ColumnsContext from '@/contexts/ColumnsContext';
import UserPlayPileGamesContext from '@/contexts/UserPlayPileGamesContext';

function Board({ setSelectedColumn, setSelectedGame, setOpenModal}) {
  const { columnsOnBoard, setColumnsOnBoard, fetchColumnsOnBoard } = useContext(ColumnsContext);
  const { userGamesOnBoard, setUserGamesOnBoard, fetchGamesOnBoard, updateUserGameColumnPositions } = useContext(UserPlayPileGamesContext);


  const [showForm, setShowForm] = useState(false);

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleHideForm = () => {
    setShowForm(false);
  };


  const handleCreateColumn = async (title) => {
    try {
      await columnService.createColumn(title);
      fetchColumnsOnBoard();
    } catch (error) {
      console.error('Error creating column', error);
    }
  };


  const handleOnDragEnd = (result) => {
    const { source, destination, type } = result;
    // console.log(`handleOnDragEnd ---> result `, {source, destination, type})

    if(!destination) return;

    if (destination.droppableId === source.droppableId &&
        destination.index === source.index) return;

    // Handle column drag
    if (type === 'column') {
      const newColumns = [...columnsOnBoard];
      const [removed] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, removed);

      setColumnsOnBoard(newColumns);
      columnService.updatePositions(newColumns.map( column => ({_id: column._id}) ));
    }

    // Handle game card drag
    if (type === 'card') {
      const sourceColumnId = source.droppableId.split('-')[1]
      const destinationColumnId = destination.droppableId.split('-')[1]

      const sourceList = Array.from(userGamesOnBoard[sourceColumnId]);

      const destinationList = sourceColumnId === destinationColumnId // Handling drag in same column
      ? sourceList : Array.from(userGamesOnBoard[destinationColumnId] || []);

      const [removed] = sourceList.splice(source.index, 1);
      destinationList.splice(destination.index, 0, removed);

      const newUserGamesOnBoard = {
        ...userGamesOnBoard,
        [sourceColumnId]: sourceList,
        [destinationColumnId]: destinationList,
      };

      setUserGamesOnBoard(newUserGamesOnBoard);

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

      updateUserGameColumnPositions(updatedColumnLists);
    }
  };


  return (
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId={`columnsBoard}`}  direction="horizontal" type="column">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-nowrap space-x-8 overflow-x-auto py-4 px-2"
              style={{ minHeight: '80vh' }}  // Ensures that the droppable area is sufficiently tall
            >

              {columnsOnBoard && columnsOnBoard.map((column, index) => (
                <Column
                  key={column._id}
                  id={column._id}
                  column={column}
                  games={ userGamesOnBoard[column._id] || []}
                  index={index}
                  setSelectedColumn={setSelectedColumn}
                  setSelectedGame={setSelectedGame}
                  setOpenModal={setOpenModal}
                />
              ))}
              {provided.placeholder}

              <div>
                {showForm ? (
                  <ColumnForm
                    onSave={(newTitle) => {
                      handleCreateColumn(newTitle);
                      handleHideForm();
                    }}
                    onCancel={handleHideForm}
                  />
                ) : (
                  <Button onClick={handleShowForm} className=" text-white font-semibold py-2 px-4 rounded inline-flex items-center focus:ring-0">
                    <span>Add list</span>
                  </Button>
                )}
              </div>


            </div>
          )}
        </Droppable>
      </DragDropContext>

  );
}

export default Board;
