import React, { useState, useEffect, useContext} from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from './Column'
import columnService from '@/services/columnService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import userGameService from '@/services/userGameService'
import ColumnsContext from '@/contexts/ColumnsContext'

function Board({columns, userGamesOnBoard}) {

  /* //FIXME: Fetch columns from backend
    4. Display the games in the columns ( will be handled in Columns.jsx)
  */
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


  // useEffect(() => {

  // }, [])

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
                // console.log('Board --> columnn map -> item ->', column)
                return (
                  <Column
                    key={column._id}
                    id={column._id}
                    column={column}
                    games={ userGamesOnBoard[column._id] || []}
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