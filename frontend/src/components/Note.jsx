import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { HiXMark } from "react-icons/hi2";


function Note({gameIgdbId, initialText, updateGame}) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);

  const toggleEdit = () => setIsEditing(!isEditing);
  const handleChange = (e) => setText(e.target.value);
  const handleSave = async () => {
    try {
      await updateGame(gameIgdbId, {notes: text})
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating Notes of UserGame ', error)
    }
  }
  return (
    <div className="p-2">
      {isEditing ? (
        <Textarea
          className="w-full min-h-36 resize-y overflow-auto bg-white border border-gray-400 rounded-md p-2 text-sm leading-6 font-normal text-gray-700"
          value={text}
          onChange={handleChange}
        />
      ) : (
        <div
          className="w-full min-h-36  bg-white border border-gray-400 rounded-md p-2 text-sm leading-6 font-normal text-gray-700"
          onClick={toggleEdit}
        >
          {text ||
            'please enter text'
          }
        </div>
      )}
    {isEditing && (
      <div className="flex justify-end">

            <Button
            variant='secondary'
            className="bg-transparent m-1"
            onClick={handleSave}
            >
            <HiXMark />
          </Button>

        <Button
          className="px-4 py-2 m-1"
          onClick={handleSave}
          >
          Save
        </Button>
        </div>
      )}

    </div>
  );
}
export default Note