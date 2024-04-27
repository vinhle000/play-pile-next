import React, { useState, useEffect} from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from './Column'
import columnService from '@/services/columnService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function Board() {

  /* //FIXME: Fetch columns from backend
    PLAN: for now we well just use the testColumn object
    1. get columns from backend for the user
    2. Which columns are isOnBoard: true, will be displayed on the board
    3. Take ids of the isOnBoard columns and fetch userGames for those columns
      This is index by userId and columnId
      // UserGameSchema.index({ userId: 1, columnId: 1 });  // Finding all userGame in a column

    4. Display the games in the columns ( will be handled in Columns.jsx)


  */

  const [columns, setColumns] = useState([])
  const [inputTitle, setInputTitle] = useState('')

  const handleCreateColumn = () => {
    try {
      columnService.createColumn(inputTitle)
      setInputTitle('');
    } catch (error) {
      console.error('Error creating column s', error)
    }
  }

  // result: dropResult
  const handleOnDragEnd = (result) => {

  }

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        let columns = columnService.getColumns();
        setColumns(columns);

      } catch (error) {
        console.error('Error fetching columns: ', error);
      }
    }
    fetchColumns();
  }, [])

  return (
    <>
      <div>Board</div>
      <div className="flex">
        <Input
          type='text'
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
          placeholder='Column Title'
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />

        <Button onClick={handleCreateColumn}>
          Create +
        </Button>
      </div>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="board" direction="horizontal" type="column">
          {(provided, snapshot) =>
            <div
              className="flex flex-nowrap overflow-x-auto justify-between px-10 "
              {...provided.droppableProps}
              ref={provided.innerRef}
            >{
              Array.from(Object.entries(columns)).map((column, index) => {
                console.log('Board --> columnn map -> item ->', column)
                return (
                  <Column
                    key={column["_id"]}
                    id={column["_id"]}
                    column={column}
                    games={[]}
                    index={index}
                  />


                )

              })
            }</div>
          }
        </Droppable>

      </DragDropContext>

    </>
  )
}

export default Board