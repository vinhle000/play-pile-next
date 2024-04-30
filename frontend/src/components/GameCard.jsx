import React, {useContext, useState, memo} from 'react'
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import UserGameDataEditModal from '@/components/UserGameDataEditModal'
import ConfirmModal from '@/components/ConfirmModal'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


import userGameService from "@/services/userGameService"
import useUserGameData from '@/hooks/useUserGameData'
import LogRocket from 'logrocket';



function GameCard ({ game, innerRef, draggableProps, dragHandleProps }) {
  const [modalState, setModalState] = useState('') // ['edit', 'remove'
  const [editGame, setEditGame] = useState({})


  const handleOpenEditModal = (e, game) => {
    e.preventDefault()
    console.log('handleOpenEditModal -> game', game)
    setModalState('edit')
    setEditGame(game)
  }

  const handleRemoveConfirm = async () => {
    try {
      await userGameService.updateUserGameData(game.igdbId, {isInPlayPile: "false"})
    } catch (error) {
      console.error('Error removing game from pile', error)
    }
    setModalState('')
  }

  const handleOnDragEnd = (result) => {
    console.log('handleOnDragEnd -> result', result);
    // TODO: Handle the actual reordering logic here
  };

  return (
    <>

    <div className="rounded-md space-y-2 drop-shadow-md "
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
      >
      <div className="flex justify-between items-center p-4"
         onClick={(e) => handleOpenEditModal(e, game)}
      >
        <img
          src={game.gameInfo.coverUrl}
          alt={game.gameInfo.name}
          className="rounded-sm min-h-48 h-60 transition duration-300 ease-in-out transform group-hover:scale-110 group-hover:brightness-50 object-cover"
        />
        {/* <div
          onClick={() => handleOpenEditModal(game)}
          className="absolute inset-0 flex items-center
                      justify-center opacity-0 group-hover:opacity-100
                      transition-opacity duration-300"
        > */}
          {/* <p className="text-white text-xl font-bold">{game.gameInfo.name}</p> */}
        {/* </div> */}
      </div>
    </div>
     {modalState === 'remove' && (
      <ConfirmModal
        title="Remove Game"
        description="Are you sure you want to remove this game from your Play Pile?"
        onConfirm={ handleRemoveConfirm }
        onCancel={() => setModalState('')}
      />
    )}


    {modalState === 'edit' && (
      <UserGameDataEditModal
        game={editGame}
        modalState={modalState}
        setModalState={setModalState}
      />
    )}
  </>




  )
}

export default GameCard

