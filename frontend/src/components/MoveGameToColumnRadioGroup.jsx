import {useState, useContext, useEffect } from 'react'
import { useForm } from "react-hook-form"
import ColumnsContext from '@/contexts/ColumnsContext';
import UserPlayPileGamesContext from '@/contexts/UserPlayPileGamesContext'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from '@/components/ui/label'



export function MoveGameToColumnRadioGroup({gameIgdbId, gameColumnId, setIsPopoverOpen}) {
  const { columns, fetchColumns, loading } = useContext(ColumnsContext);
  const { userPlayPileGame, updateUserGameData} = useContext(UserPlayPileGamesContext)
  const [assignedColumn, setAssignedColumn ] = useState(gameColumnId)


  const handleOnClickSave = async () =>{
    try {
     await updateUserGameData(gameIgdbId, assignedColumn)
    } catch (error) {
      console.error('Error assigning game dsafdafsdto column', {assignedColumn, gameIgdbId})
    } finally {
      setIsPopoverOpen(false)
    }

  }

  useEffect( () => {
    fetchColumns()
  }, [])

  //Refactor to remove form, not necessary
  return (
    <div className=" space-y-6">
          <RadioGroup
      onValueChange={setAssignedColumn}
      defaultValue={gameColumnId}
      className="flex flex-col space-y-1"
    >
      {columns.map((column) => {
        return (
          <div key={column._id}  className="flex items-center space-x-2 space-y-0 text-xs">
            <RadioGroupItem  value={column._id} />
            <Label>{column.title}</Label>
          </div>
        )
      })}
    </RadioGroup>
      <Button onClick={handleOnClickSave}> Save </Button>

    </div>



  )
}

export default MoveGameToColumnRadioGroup;