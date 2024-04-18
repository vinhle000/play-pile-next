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
import UserBacklogContext from '@/contexts/UserBacklogContext'
import useUserGameData from '@/hooks/useUserGameData'
import LogRocket from 'logrocket';




//TODO: Decide to show this menu on hover? or always show it with the popover menu to quickly change the status
// function statusEditMenuOptions () {
//   return (
//     <div className="-mt-px flex divide-x divide-gray-200">
//     <Popover>
//       <PopoverTrigger className="flex w-0 flex-1">
//           <div className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
//           Played
//           <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
//           </div>
//         </PopoverTrigger>
//       <PopoverContent>Place content for the popover here.</PopoverContent>
//     </Popover>
//     <Popover>
//       <PopoverTrigger className="flex w-0 flex-1">
//           <div className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
//           Played
//           <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
//           </div>
//         </PopoverTrigger>
//       <PopoverContent>Place content for the popover here.</PopoverContent>
//     </Popover>
//     </div>
//   )
// }

function GameCard ({ game, handleOpenEditModal, setModalState }) {


  // const [modalState, setModalState] = useState(''); // '' or 'edit' or 'remove'
  // console.log('GameCard -> modalState', modalState)
  const handleRemoveConfirm = async () => {

    try {
      await userGameService.updateUserGameData(game.igdbId, {isInBacklog: "false"})

    } catch (error) {
      console.error('Error removing game from backlog', error)
    }
    setModalState('')
  }


  return (

    <li  className="relative group">
      <img
        src={game.cover.url}
        alt={game.name}
        className="rounded-sm min-h-48 h-60 transition duration-300 ease-in-out transform group-hover:scale-110 group-hover:brightness-50 object-cover"

      />
      <div onClick={() => handleOpenEditModal(game)} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-white text-xl font-bold">{game.name}</p>
      </div>


  </li>


  )
}

export default GameCard

