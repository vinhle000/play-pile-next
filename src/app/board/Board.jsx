'use client';
import React, { useState, useContext, useCallback } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import Column from './Column';
import ColumnForm from './ColumnForm';
import { ColumnsContext } from '@/app/providers/ColumnsProvider';
import { UserGamesContext } from '@/app/providers/UserGamesProvider';

import { TailSpin } from 'react-loader-spinner';

function Board({ setSelectedColumn, setSelectedGame, setOpenModal }) {
  const {
    columnsOnBoard,
    setColumnsOnBoard,
    createColumn,
    updateColumnPositions,
  } = useContext(ColumnsContext);
  const {
    userGamesOnBoard,
    setUserGamesOnBoard,
    updateUserGameColumnPositions,
  } = useContext(UserGamesContext);

  const [showForm, setShowForm] = useState(false);

  const handleShowForm = useCallback(() => {
    setShowForm(true);
  }, []);

  const handleHideForm = useCallback(() => {
    setShowForm(false);
  }, []);

  const handleCreateColumn = useCallback(
    async (title) => {
      try {
        await createColumn(title);
      } catch (error) {
        console.error('Error creating column', error);
      }
    },
    [createColumn],
  );

  const handleOnDragEnd = useCallback(
    (result) => {
      const { source, destination, type } = result;

      if (!destination) return;

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      )
        return;

      // Handle column drag
      if (type === 'column') {
        console.log(`handleOnDragEnd ---> result `, {
          source,
          destination,
          type,
        });
        const newColumns = [...columnsOnBoard];
        const [removed] = newColumns.splice(source.index, 1);
        newColumns.splice(destination.index, 0, removed);

        setColumnsOnBoard(newColumns); //TODO: decide to optimistaclly update here? or in context
        updateColumnPositions(
          newColumns.map((column) => ({ _id: column._id })),
        );
      }

      // Handle game card drag
      if (type === 'card') {
        const sourceColumnId = source.droppableId.split('-')[1];
        const destinationColumnId = destination.droppableId.split('-')[1];

        const sourceList = Array.from(userGamesOnBoard[sourceColumnId]);
        const destinationList =
          sourceColumnId === destinationColumnId // Handling drag in same column
            ? sourceList
            : Array.from(userGamesOnBoard[destinationColumnId] || []);

        const [removed] = sourceList.splice(source.index, 1);
        destinationList.splice(destination.index, 0, removed);

        setUserGamesOnBoard((prev) => ({
          ...prev,
          [sourceColumnId]: sourceList,
          [destinationColumnId]: destinationList,
        }));

        const updatedColumnLists = {
          source: {
            columnId: sourceColumnId,
            userGames: sourceList,
          },
          destination: {
            columnId: destinationColumnId,
            userGames: destinationList,
          },
        };

        updateUserGameColumnPositions(updatedColumnLists);
      }
    },
    [
      columnsOnBoard,
      userGamesOnBoard,
      setColumnsOnBoard,
      setUserGamesOnBoard,
      updateColumnPositions,
      updateUserGameColumnPositions,
    ],
  );

  if (!columnsOnBoard || !userGamesOnBoard) {
    return <TailSpin color="#00BFFF" height={80} width={80} />;
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="all-columns" direction="horizontal" type="column">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex flex-nowrap space-x-8 overflow-x-auto py-4 px-2"
            style={{ minHeight: '80vh' }} // Ensures that the droppable area is sufficiently tall
          >
            {columnsOnBoard &&
              columnsOnBoard.map((column, index) => (
                <Column
                  key={column._id}
                  id={column._id}
                  column={column}
                  games={userGamesOnBoard[column._id] || []}
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
                <Button
                  onClick={handleShowForm}
                  className="w-100 p-2 space-y-2  bg-gray-100/20 -z-20 rounded-2xl shadow-md hover:bg-gray-100/30
                  backdrop-filter text-black/90 font-semibold py-2 px-4  inline-flex items-center focus:ring-0"
                >
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

export default React.memo(Board);
