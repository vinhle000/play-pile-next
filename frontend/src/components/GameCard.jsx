import React, {useContext, useState, memo} from 'react'
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import UserGameDataEditModal from '@/components/UserGameDataEditModal'
import { TrophyIcon, CheckIcon } from '@heroicons/react/24/solid'


import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import userGameService from "@/services/userGameService"
import useUserGameData from '@/hooks/useUserGameData'

//FIXME: Need to memoize this component with hook, so that we can rerend just the CARD that is being updated,
// editModal saved changes dont appear until page refresh

function GameCard ({ game, innerRef, draggableProps, dragHandleProps, snapshot, setSelectedGame, setOpenModal }) {


  const gameStatusIcon = (gameStatus) => {
    switch (gameStatus) {
      case 'Completed':
        return <TrophyIcon className="w-6 h-6 text-gray-500" />
      case 'Finished':
          return <CheckIcon className="w-6 h-6 text-gray-500" />
      case 'Playing':
        // return <ControllerIcon className="w-6 h-6 text-gray-500" />
      case 'Abandoned':
        // return <XIcon className="w-6 h-6 text-gray-500" />
      case 'Not Started':
        // return <XIcon className="w-6 h-6 text-gray-500" />
      default:
        return <div className="text-xs  text-gray-500">Not Owned</div>
    }
  }


  const draggingStyle = snapshot.isDragging ? { zIndex: 1000 } : {};



  return (

    <div className={`w-72 relative bg-white/70 rounded-xl backdrop-blur-sm shadow-lg
    transition-transform duration-300 ease-in-out hover:scale-105`}
          {...draggableProps}
          {...dragHandleProps}
          ref={innerRef}

    >


    <div className=" flex items-top justify-between"
      onClick={() => {
        setSelectedGame(game)
        setOpenModal('edit')
      }}
    >

          <div className=" object-cover">
            <img
              className="max-w-28 rounded-tl-xl rounded-bl-xl object-cover"
              src={game.gameInfo.coverUrl}
              alt={game.gameInfo.name}
            />
          </div>



        <div className="flex flex-col flex-inline align-top justify-between items-center pr-3">
          {/*  game title*/}
            <div className="h-1/4 justify-start text-black text-sm font-normal pt-2">
              {game.gameInfo.name}
            </div>


            {/* description or achievements */}
            <div className="h-12 justify-start text-left  text-wrap
                           text-black text-xs font-light leading-tight">
              Achievement/Pinned Notes
            </div>

              {/*  game status */}
            <div className="flex min-w-full p-2 justify-end">
              {gameStatusIcon(game.playedStatus)}

            </div>

          </div>
      </div>
    </div>


  )
}

export default GameCard

