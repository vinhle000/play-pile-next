import React, {useState} from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import logRocket from 'logrocket'


// function Modal({children, onClose}) {

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-20 z-50 flex justify-center items-center">
//         <div className="bg-white p-5 rounded">
//           {children}
//           <div> </div>
//         <div>
//             <label> Playing Status:  </label>
//             <select
//               name="playingStatus"
//               value={userGameData.playingStatus} onChange={(e) => setUserGameData({...userGameData, playingStatus: e.target.value})}
//             >

//             </select>
//         </div>
//         <div> {}</div>

//           <button
//             className="mt-5 px-4 py-2 bg-red-400 text-white rounded hover:bg-red-700"
//             onClick={onClose}
//           >
//             Close
//           </button>
//         </div>
//     </div>
//   )
// }


function UserGameDataEditModal({userGameData, setUserGameData, onClose}) {
  const [formData, setFormData] = useState({
    playingStatus: userGameData.playingStatus,
    playedStatus: userGameData.playedStatus,
    dates: userGameData.dates,
    notes: userGameData.notes,
  })



  //TODO: On save, update the userGameData
  const updateUserGameData = async (igdbId, updateData) => {
    updateData ? updateData : {}
    try {
      //NOTE: Only rerenders the GameCard component in the list that has the updated changes
      // Utilizing useUserGameData hook to manage the state of the game data
      // with the use of React.useMemo and React.useCallback
     let newData = await userGameService.updateUserGameData(igdbId, {...updateData})

     setUserGameData({...userGameData, ...newData})
     console.log('GameCard -> updateBacklog -> newData', newData)
      LogRocket.log('userGameData updated successfully', newData);

    } catch (error) {
      console.error('Error updating UserGame Data ', error)
      LogRocket.error('Error updating UserGame Data ', error);
    }
  }
//     <div className="fixed inset-0 bg-black bg-opacity-20 z-50 flex justify-center items-center">
//         <div className="bg-white p-5 rounded">

  return (
    <>
      <Dialog className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 flex items-center justify-center bg-black/30" >

          <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <DialogTitle className="text-lg font-medium leading-6 text-gray-900">
              Edit Log
            </DialogTitle>

            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={()=> setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => updateUserGameData()}>Save</Button>
            </div>

         </div>




        </div>
      </Dialog>
    </>

  )
}

export default UserGameDataEditModal