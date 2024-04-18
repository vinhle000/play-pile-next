import React, {useState} from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import userGameService from '@/services/userGameService'
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



function UserGameDataEditModal({game, userGameData, setUserGameData, onClose}) {
  const [fieldData, setFieldData] = useState({
    ...userGameData
  })




  const updateUserGameData = async (igdbId, updateData) => {
    updateData ? updateData : {}
    try {
     console.log('GameCard -> updateBacklog -> updateData', updateData)
     let newData = await userGameService.updateUserGameData(igdbId, {...updateData})

     setUserGameData({...userGameData, ...newData})

     console.log('GameCard -> updateBacklog -> newData', newData)

    } catch (error) {
      console.error('Error updating UserGame Data ', error)
    }
  }


  const handleSave = async (igdbId) => {
    console.log('handleSave -> fieldData', fieldData)
    try {
      await updateUserGameData(igdbId, fieldData)

    } catch (error) {
      console.error('Error saving(updating) UserGame Data ', error)
    }
    onClose()
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
      <Dialog className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 flex items-center justify-center bg-black/30" >

          <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">

            <DialogTitle className="text-lg font-medium leading-6 text-gray-900">
              Edit Log
            </DialogTitle>
             {/*  TODO: Dates  */}
            <div> dates </div>

            {/* playingStatus    played status */}
            <div>
              <div>
              <DropdownMenu>
                <DropdownMenuTrigger>{fieldData.playingStatus}</DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => handleFieldChange('playingStatus', 'Not started') }>No status</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleFieldChange('playingStatus', 'Currently Playing') }>Finished</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleFieldChange('playingStatus', 'Endless') }>Completed</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleFieldChange('playingStatus', 'Replaying') }>Dropped</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </div>

              <div>
                <DropdownMenu>
                <DropdownMenuTrigger>{fieldData.playedStatus}</DropdownMenuTrigger>
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



            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => updateUserGameData(game.igdbId, {isInBacklog: false})  }>
                Remove
              </Button>
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => handleSave(game.igdbId)}>Save</Button>
            </div>

         </div>




        </div>
      </Dialog>
    </>

  )
}

export default UserGameDataEditModal