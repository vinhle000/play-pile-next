import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'



function Note({initialText, handleFieldChange}) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);

  const toggleEdit = () => setIsEditing(!isEditing);
  const handleChange = (e) => setText(e.target.value);
  const handleSave = () => {

    handleFieldChange('notes', text)
    setIsEditing(false);
  }
  return (
    <div className="p-2">
      {isEditing ? (
        <Textarea
          className="w-full min-h-[80px] resize-y bg-white border border-gray-400 rounded-md p-2 text-sm leading-6 font-normal text-gray-700"
          value={text}
          onChange={handleChange}
        />
      ) : (
        <div
          className="w-full min-h-[80px] bg-white border border-gray-400 rounded-md p-2 text-sm leading-6 font-normal text-gray-700"
          onClick={toggleEdit}
        >
          {text ||
            'please enter text'
          }
        </div>
      )}
    {isEditing && (
      <div>

            <Button
            variant='secondary'
            className="px-4 py-2"
            onClick={handleSave}
            >
            x
          </Button>

        <Button
          className="px-4 py-2"
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