import { useState, useContext } from 'react'
import userGameService from '@/services/userGameService'
import ConfirmModal from '@/components/ConfirmModal'
import Note from '@/components/Note'
import LinkEmbedder from '@/components/LinkEmbedder'
import AttachmentInput from '@/components/AttachmentInput'
import AttachmentsList from '@/components/AttachmentsList'

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



function UserGameDataEditModal({game, openModal, setOpenModal}) { // game has UserGameData and Game details

  const {setUserPlayPileGames, userPlayPileGames, updateUserGameData } = useContext(UserPlayPileGamesContext) // {playDates, playingStatus, playedStatus, notes}


  // TODO: Making this modal persist upon change immediately without the save button to submit
  //
  const [fieldData, setFieldData] = useState({
    columnId: game.columnId,
    //BUG: after moving the game to a diffenrt colunn on the board. Updating the game data through this modal with save,
    // reasigns its old values. So the game moves back to its previous column

    playDates: game?.playDates || [{ from: new Date(), to: new Date()}], // This is an array of Dates,
    playingStatus: game.playingStatus,
    playedStatus: game.playedStatus,
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
    }
  }

  const handleDateChange = async (date) => {
    if (fieldData.playDates) {
      if (fieldData.playDates[0] != date ) {
        setFieldData((prevState) => {
          //TODO: Implement pushing the new Date the the playDates array
          return {
            ...prevState,
            'playDates': [date]
           }
        });
      }
    }

  }


  const handleSave = async (igdbId) => {
    console.log( 'handleSave -----> fieldData', fieldData)

    try {
      await updateGame(igdbId, fieldData)
    } catch (error) {
      console.error('Error saving(updating) UserGame Data ', error)
    }
    setOpenModal('')
  }

  const handleFieldChange = (field, value) => {
    setFieldData((prevState) => {
      return {
        ...prevState, [field]: value
      }
    })
  }


  return (
    <>
      <Dialog className="flex flex-col justify-between z-50 overflow-auto">
        <div className="fixed inset-0 flex items-center justify-center bg-black/30" >
          <div className="w-full max-w-md transform overflow-auto rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">

            <DialogTitle className="text-lg font-medium leading-6 text-gray-900">
             {game.gameInfo.name}
            </DialogTitle>


             {/*  TODO: Keep track of state of all available columns(lists) using columnId  */}

             <div className="my-3">
             {/*  TODO: Dates  functionality */}
              <DateRangePicker
                className="bg-white/95"
                handleDateChange={handleDateChange}
                date={newPlayDate}
                setDate={setNewPlayDate}
              />
            </div>


                <DropdownMenu>
                  <Label>Status: </Label>
                  <DropdownMenuTrigger>
                    <div className="my-2 p-2 border round-md border-gray-500">
                      {fieldData.playedStatus}
                      </div>
                      </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white/95">

                  <DropdownMenuItem onSelect={() => handleFieldChange('playedStatus', 'Not Started')}>No Started</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleFieldChange('playedStatus', 'Playing')}>Playing</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleFieldChange('playedStatus', 'Finished')}>Finished</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleFieldChange('playedStatus', 'Completed')}>Completed</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleFieldChange('playedStatus', 'Abandoned')}>Abandoned</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div>
                  <Label>Notes:</Label>
                  {/*FUTURE: Eventually make a list of notes*/}
                  <Note initialText={fieldData.notes} handleFieldChange={handleFieldChange}/>
                </div>

                <div>
                  <Label>Links:</Label>

                  <LinkEmbedder embeddedLinks={embeddedLinks} setEmbeddedLinks={setEmbeddedLinks} />
                  {/* <Label>lists:</Label> */}

{/*
                    <AttachmentInput onChange={handleAddAttachment} />
                    <AttachmentsList attachments={attachments} /> */}

                 </div>

                <div className="flex justify-end ">
                  {/* <Button onClick={()=> {}} variant="destructive">Remove</Button> */}
                  <Button onClick={() => setOpenModal('')} variant="secondary">Close</Button>
                  <Button onClick={() => handleSave(game.igdbId)}>Save</Button>
                </div>




           </div>
          </div>
        </Dialog>

    </>

  )
}

export default UserGameDataEditModal