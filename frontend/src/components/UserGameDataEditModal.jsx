import React, {useState} from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import userGameService from '@/services/userGameService'
import ConfirmModal from '@/components/ConfirmModal'
import DateRangePicker from '@/components/DateRangePicker'

import logRocket from 'logrocket'

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




function UserGameDataEditModal({game, modalState, setModalState}) { // game has UserGameData and Game details

  console.log('UserGameDataEditModal -> game', game)
  console.log('UserGameDataEditModal -> modalState', modalState)

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
      <Dialog className="fixed inset-0 z-100 overflow-y-auto">
        <div className="fixed inset-0 flex items-center justify-center bg-black/30" >
          <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">

            <DialogTitle className="text-lg font-medium leading-6 text-gray-900">
              Edit Log
            </DialogTitle>
             {/*  TODO: Dates  */}
            <div>
              <DateRangePicker handleFieldChange={handleFieldChange} />
               </div>

            {/* playingStatus    played status */}
            <div className="flex space-x-4">
              <div className="flex-1 min-w-0 bg-gray-500">
              <DropdownMenu>
                <DropdownMenuTrigger  className="w-full">{fieldData.playingStatus}</DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => handleFieldChange('playingStatus', 'Not started') }>No started</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleFieldChange('playingStatus', 'Currently Playing') }>Currently Playing</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleFieldChange('playingStatus', 'Endless') }>Endless</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleFieldChange('playingStatus', 'Replaying') }>Replaying</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </div>

              <div className="flex-1 min-w-0">
                <DropdownMenu>
                <DropdownMenuTrigger  className="w-full">{fieldData.playedStatus}</DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => handleFieldChange('playedStatus', 'No status') }>No status</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleFieldChange('playedStatus', 'Finished') }>Finished</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleFieldChange('playedStatus', 'Completed') }>Completed</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleFieldChange('playedStatus', 'Dropped') }>Dropped</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </div>
            </div>


              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    name="notes"
                    value={fieldData.notes}
                    onChange={()=> handleFieldChange('notes', event.target.value)}
                  />
                </div>
              </div>



              <div className="mt-4 flex justify-between items-center gap-2 w-full">
                <Button variant="destructive" onClick={() => setModalState('remove')}>
                  Remove
                </Button>
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" onClick={() => setModalState('')}>
                    Close
                  </Button>
                  <Button onClick={() => handleSave(game.igdbId)}>Save</Button>

                </div>
              </div>

           </div>
          </div>
        </Dialog>

    </>

  )
}

export default UserGameDataEditModal