import { useState } from 'react';

const CreateHabitModal = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [day, setDay] = useState('Monday');
  const [color, setColor] = useState('#00ff00');

  const handleSubmit = () => {
    onSubmit({ title, day, color });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Create a habit</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-xl">&times;</button>
        </div>

        {/* Title input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:bg-[#FBD443]"
          />
        </div>

        {/* Day select */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Choose days</label>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:bg-[#FBD443]"
          >
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Color picker */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Choose color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-12 p-0 border-none bg-transparent cursor-pointer"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-[#FBD443] text-white hover:bg-[#FBD443]"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateHabitModal;
