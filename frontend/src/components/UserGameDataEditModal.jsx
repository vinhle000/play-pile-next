import { useState, useContext } from 'react'
import userGameService from '@/services/userGameService'
import ConfirmModal from '@/components/ConfirmModal'
import Note from '@/components/Note'
import LinkEmbedder from '@/components/LinkEmbedder'

import { TrophyIcon, CheckIcon } from '@heroicons/react/24/solid'
import { XCircleIcon, PlayIcon, ArrowPathIcon, PauseIcon, CheckCircleIcon, CheckBadgeIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { FaInfinity, FaCircleStop } from "react-icons/fa6";
import { HiXMark } from "react-icons/hi2";
import { FaCheck } from "react-icons/fa";

import UserPlayPileGamesContext from '@/contexts/UserPlayPileGamesContext'
import ColumnsContext from '@/contexts/ColumnsContext'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"

import DateRangePicker from '@/components/DateRangePicker'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Popover, PopoverContent, PopoverTrigger
} from "@/components/ui/popover"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const gameStatusIcon = (gameStatus) => {
  switch (gameStatus) {
    case 'Not owned':
      return <XCircleIcon className="w-5 h-6"/>;
    case 'Playing':
      return <PlayIcon className="w-5 h-6"/>;
    case 'Replaying':
      return <ArrowPathIcon className="w-5 h-6"/>
    case 'Endless':
      return <FaInfinity className="w-5 h-6"/>
    case 'Paused':
      return <PauseIcon className="w-5 h-6"/>
    case 'Finished':
      return <FaCheck className="w-5 h-6"/>
    case 'Completed':
      return <TrophyIcon className="w-5 h-6"/>
    case 'Abandoned':
      return <FaCircleStop className="w-5 h-6"/>
    default:
      return <div></div>
  }
}

const gameStatusList = [
  'Not started',
  'Not owned',
  'Playing',
  'Replaying',
  'Endless',
  'Paused',
  'Finished',
  'Completed',
  'Abandoned'
]



function UserGameDataEditModal({game, openModal, setOpenModal}) { // game has UserGameData and Game details

  const {setUserPlayPileGames, userPlayPileGames, updateUserGameData } = useContext(UserPlayPileGamesContext) // {playDates,  playStatus, notes}


  // TODO: Making this modal persist upon change immediately without the save button to submit
  //
  const [fieldData, setFieldData] = useState({
    // REMOVE: 5.24.24 - Should Not occur anymore after immediate update for each field, instead of waiting for save
    //BUG: after moving the game to a diffenrt colunn on the board. Updating the game data through this modal with save,
    // reasigns its old values. So the game moves back to its previous column
    // columnId: game.columnId,
    playDates: game?.playDates || [{ from: new Date(), to: new Date()}], // This is an array of Dates,
    playStatus: game.playStatus,
    notes: game.notes
  })

  //For now just using the first date in the array
  const [newPlayDate, setNewPlayDate] = useState(
    {...fieldData.playDates[0]} || { from: new Date(), to: new Date()}
  );

  const [embeddedLinks, setEmbeddedLinks] = useState([])




  const updateGame = async (igdbId, updateData) => {
    updateData ? updateData : {}
    try {
     let newData = await updateUserGameData(igdbId, {...updateData})
     setUserPlayPileGames({...userPlayPileGames, ...newData})
    } catch (error) {
      console.error('Error updating UserGame Data ', error)
      throw error
    }
  }


  const handlePlayStatusChange = async (status) => {
    try {
       await updateGame(game.igdbId, {playStatus: status})

       setFieldData((prevState) => {
         return {
          ...prevState,
          playStatus: status
         }
       })
    } catch (error) {
      console.error('Error updating Play Status of UserGame', error)
    }
  }



  const handleDateChange = async (date) => {
    if (fieldData.playDates) {
      if (fieldData.playDates[0] != date ) {
        try {
          await updateGame(game.igdbId, {playDates: [date]})
             // Optimistic update - for faster UI response
          setFieldData((prevState) => {
            //TODO: Implement pushing the new Date the the playDates array
            return {
              ...prevState,
              'playDates': [date]
            }
          });
        } catch (error) {
          console.error('Error saving(updating) Date of UserGame', error)
        }
      }
    }
  }

  return (
    <>
      <Dialog className="relative z-50">
        <div className="fixed inset-0 flex items-center justify-center bg-black/20" >
          <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white/95 text-left align-middle shadow-xl transition-all">


            {/* Scrollable content area */}
            <div className="overflow-y-auto max-h-screen">
            <div className="relative bg-cover bg-center h-40 rounded-t-xl"
                     style={{ backgroundImage: `url(${game.gameInfo.coverUrl})`}} >

                {/* Overlay that creates the blur effect towards the bottom */}
               <div className="absolute inset-0 flex items-end justify-center">
                <div
                  className="relative w-full h-3/4 backdrop-filter bg-gradient-to-b from-transparent via-transparent to-white/95"
                >
                    <DialogTitle className="absolute top-16 bg-transparent  my-8 mx-4 text-xl font-bold text-gray-900">
                        {game.gameInfo.name}
                      </DialogTitle>
                </div>
              </div>

            </div>


            <div className="p-4">
             {/*  TODO: Keep track of state of all available columns(lists) using columnId  */}
             <div className="play-dates my-3 flex gap-2 items-center">
              <Label>Dates:</Label>
              <DateRangePicker
                className=" rounded-lg shadow-sm border border-gray-300 "
                handleDateChange={handleDateChange}
                date={newPlayDate}
                setDate={setNewPlayDate}
              />
            </div>

            <div className="play-status flex gap-2 items-center">
                <DropdownMenu>
                  <Label>Status: </Label>
                  <DropdownMenuTrigger>
                    <div className="flex gap-2 my-1 p-1 rounded-lg shadow-sm border border-gray-300 max-w-max">
                      {fieldData.playStatus} {gameStatusIcon(fieldData.playStatus)}
                    </div>
                      </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white/95">
                    {gameStatusList.map((status) => {
                      return (
                        <DropdownMenuItem
                          key={status}
                          onSelect={() => handlePlayStatusChange(status)}
                          className="flex justify-between"
                        >
                          {status} {gameStatusIcon(status)}
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

                <div className="notes ">
                  <Label>Notes:</Label>
                  {/*FUTURE: Eventually make a list of notes*/}
                  <Note
                    gameIgdbId={game.igdbId}
                    initialText={fieldData.notes}
                    updateGame={updateGame}
                  />
                </div>

                {/*TODO: NOW - persist the links to the server! and implement the remove userGame from list button */}
                <div>
                  <Label>Links:</Label>
                  <LinkEmbedder embeddedLinks={embeddedLinks} setEmbeddedLinks={setEmbeddedLinks} />
                 </div>

                <div className="flex justify-end ">
                  {/* <Button onClick={()=> {}} variant="destructive">Remove</Button> */}
                  <Button onClick={() => setOpenModal('')} variant="secondary">Close</Button>
                  {/* <Button onClick={() => handleSave(game.igdbId)}>Save</Button> */}
                </div>
                </div>

              </div>

           </div>
          </div>
        </Dialog>

    </>

  )
}

export default UserGameDataEditModal