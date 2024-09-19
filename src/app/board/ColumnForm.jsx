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
        className="w-full rounded-md border-0 bg-gray-100/20  py-1.5 pl-10  text-gray-300
        placeholder:text-black/50  focus:bg-gray-100/40 focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
        placeholder="Enter list title…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength="512"
      />
      <div className="flex items-center space-x-2">
        <Button
          type="submit"
          className="bg-gray-100/20 hover:bg-gray-100/30 text-gray-800 py-2 px-4 rounded-2xl font-medium"
        >
          Add list
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          className="bg-gray-100/20 hover:bg-gray-100/30 text-gray-800 py-2 px-4 rounded-2xl font-medium"
        >
          <span className="inline-block">X</span>
        </Button>
      </div>
    </form>
  );
}

export default ColumnForm;
