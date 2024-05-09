import React, {useState} from 'react'
import userGameService from '@/services/userGameService'
import ConfirmModal from '@/components/ConfirmModal'
import DateRangePicker from '@/components/DateRangePicker'
import MoveGameToColumnRadioGroup from '@/components/MoveGameToColumnRadioGroup'

import logRocket from 'logrocket'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"

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


function UserGameDataEditModal({game, modalState, setModalState}) { // game has UserGameData and Game details

  const [fieldData, setFieldData] = useState({
    playDates: game.playDates,
    playingStatus: game.playingStatus,
    playedStatus: game.playedStatus,
    notes: game.notes
  })

  const updateUserGameData = async (igdbId, updateData) => {
    updateData ? updateData : {}
    try {
     let newData = await userGameService.updateUserGameData(igdbId, {...updateData})
     setUserGameData({...userGameData, ...newData})
      logRocket.log('userGameData updated successfully', newData)
    } catch (error) {
      console.error('Error updating UserGame Data ', error)
      logRocket.error('Error updating UserGame Data ', error)
    }
  }


  const handleSave = async (igdbId) => {
    try {
      await updateUserGameData(igdbId, fieldData)
    } catch (error) {
      console.error('Error saving(updating) UserGame Data ', error)
    }
    setModalState('')
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
      <Dialog className="flex-col justify-betweenz-100 overflow-y-auto">
        <div className="fixed inset-0 flex items-center justify-center bg-black/30" >
          <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">

            <DialogTitle className="text-lg font-medium leading-6 text-gray-900">
             {game.gameInfo.name}
            </DialogTitle>


             {/*  TODO: Keep track of state of all available columns(lists) using columnId  */}
             <div className="mt-1">
              <Popover>
                <PopoverTrigger>ListName</PopoverTrigger>
                <PopoverContent className="w-auto">
                  <MoveGameToColumnRadioGroup />
                </PopoverContent>
              </Popover>
            </div>

             {/*  TODO: Dates  functionality */}
             <DateRangePicker onChange={(dates) => handleFieldChange('playDates', dates)} />

                <DropdownMenu>
                  <DropdownMenuTrigger>{fieldData.playingStatus}</DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => handleFieldChange('playingStatus', 'Not started')}>Not started</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleFieldChange('playingStatus', 'Currently Playing')}>Currently Playing</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleFieldChange('playingStatus', 'Endless')}>Endless</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleFieldChange('playingStatus', 'Replaying')}>Replaying</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger>{fieldData.playedStatus}</DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => handleFieldChange('playedStatus', 'No status')}>No status</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleFieldChange('playedStatus', 'Finished')}>Finished</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleFieldChange('playedStatus', 'Completed')}>Completed</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleFieldChange('playedStatus', 'Dropped')}>Dropped</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={fieldData.notes}
                    onChange={e => handleFieldChange('notes', e.target.value)}
                  />
                </div>

                <div className="flex justify-between">
                  <Button onClick={()=> {}} variant="destructive">Remove</Button>
                  <Button onClick={() => setModalState('')} variant="secondary">Close</Button>
                  <Button onClick={handleSave} variant="primary">Save</Button>
                </div>




           </div>
          </div>
        </Dialog>

    </>

  )
}

export default UserGameDataEditModal