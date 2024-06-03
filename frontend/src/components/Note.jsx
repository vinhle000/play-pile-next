import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { HiXMark } from "react-icons/hi2";


function Note({initialText, updateGame}) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);

  const toggleEdit = () => setIsEditing(!isEditing);
  const handleChange = (e) => setText(e.target.value);
  const handleSave = async () => {
    try {
      await updateGame({notes: text})
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating Notes of UserGame ', error)
    }
  }
  return (
    <div className="p-2">
      {isEditing ? (
        <Textarea
          className="w-full min-h-36 resize-y overflow-auto bg-white border border-gray-400 rounded-md shadow-md p-2 text-sm leading-6 font-normal text-gray-700"
          value={text}
          onChange={handleChange}
        />
      ) : (
        <div
          className="w-full min-h-36 border border-gray-400 rounded-md p-2 text-sm leading-6 font-normal text-gray-700 cursor-pointer whitespace-pre-wrap"
          onClick={toggleEdit}
        >
          {text || 'please enter text'}
        </div>
      )}
      <div className="flex justify-end min-h-12 m-1 gap-1">
        {isEditing && (
          <>
            <Button variant="secondary" className="p-1 bg-transparent" onClick={toggleEdit}>
              <HiXMark />
            </Button>
            <Button className="p-2 text-white/95" onClick={handleSave}>
              Save
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
export default Note