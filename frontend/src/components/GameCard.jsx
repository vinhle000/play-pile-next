import React, {useContext, useState, memo} from 'react'
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import UserGameDataEditModal from '@/components/UserGameDataEditModal'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import userGameService from "@/services/userGameService"
import useUserGameData from '@/hooks/useUserGameData'
import LogRocket from 'logrocket';


function GameCard ({ game, innerRef, draggableProps, dragHandleProps, snapshot, handleOpenEditModal }) {
  const draggingStyle = snapshot.isDragging ? { zIndex: 1000 } : {};
  return (

    <div className={`w-72 relative bg-zinc-300 rounded-lg z-50`}
          {...draggableProps}
          {...dragHandleProps}
          ref={innerRef}

    >


    <div className=" flex content- items-top">
      <div className="m-1">
          <div className=" object-cover">
            <img
              className="max-w-28 rounded-lg object-cover"
              src={game.gameInfo.coverUrl}
              alt={game.gameInfo.name}
            />
          </div>

      </div>


            {/*  game title*/}
        <div className="flex flex-col flex-inline align-top justify-between items-center">
            <div className="h-1/4 justify-start text-black text-sm font-normal pt-2">
              {game.gameInfo.name}
            </div>


            {/* description */}
            <div className="h-12 justify-start text-left  text-wrap
                           text-black text-xs font-light leading-tight">
              Acheivement place holder
              </div>

          <div className="w-12 h-7 ">
            <div className="w-212 h-7 pr-2.5 pb-1 justify-start items-start gap-8 inline-flex">
            <div className="w-6 h-6 relative flex-col justify-start items-start flex" />
            <div className="w-6 h-6 relative flex-col justify-start items-start flex" />
            </div>
          </div>

          </div>
      </div>

       {/* <div className="w-full h-60 left-0 top-0 absolute bg-zinc-300 rounded-lg" /> */}

    {/*  tages */}
    {/* <div className="justify-evenly inline-flex w-full  ">
        <div className="w-4 h-1 bg-red-500 rounded" />
        <div className="w-4 h-1 bg-purple-600 rounded" />
        <div className="w-4 h-1 bg-emerald-400 rounded" />
        <div className="w-4 h-1 bg-cyan-600 rounded" />
      </div> */}



    </div>


  )
}

export default GameCard

