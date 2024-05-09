import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function ColumnForm({ onSave, onCancel }) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(title);
    setTitle(''); // Reset the input after saving
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <Input
        className="w-full p-2 text-sm  rounded shadow-inner  bg-black/10 text-black/60 resize-none "
        placeholder="Enter list title…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength="512"
      />
      <div className="flex items-center space-x-2">
        <Button type="submit" className="text-white py-2 px-4 rounded font-medium">
          Add list
        </Button>
        <Button type="button" onClick={onCancel} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded font-medium">
          <span className="inline-block p-1">
            X
          </span>
        </Button>
      </div>
    </form>
  );
}

export default ColumnForm;
