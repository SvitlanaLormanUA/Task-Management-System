import { useState } from 'react';
import { X } from 'lucide-react';

type DayCode = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU';

function CreateHabitModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [selectedDays, setSelectedDays] = useState<DayCode[]>([]);
  const [color, setColor] = useState('#3B82F6');
  const [isLoading, setIsLoading] = useState(false);

  const days = [
    { code: 'MO', name: 'Monday' },
    { code: 'TU', name: 'Tuesday' },
    { code: 'WE', name: 'Wednesday' },
    { code: 'TH', name: 'Thursday' },
    { code: 'FR', name: 'Friday' },
    { code: 'SA', name: 'Saturday' },
    { code: 'SU', name: 'Sunday' },
  ];

  const colors = [
    '#3B82F6',
    '#EF4444',
    '#10B981',
    '#F59E0B',
    '#8B5CF6',
    '#EC4899',
    '#06B6D4',
    '#84CC16',
  ];

  const dayCodeToName = {
    MO: 'Monday',
    TU: 'Tuesday',
    WE: 'Wednesday',
    TH: 'Thursday',
    FR: 'Friday',
    SA: 'Saturday',
    SU: 'Sunday',
  };

  const toggleDay = (dayCode: DayCode) => {
    setSelectedDays((prev) =>
      prev.includes(dayCode) ? prev.filter((code) => code !== dayCode) : [...prev, dayCode],
    );
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;

    setIsLoading(true);
    const habitDays = selectedDays.map((code) => dayCodeToName[code]);

    const habitData = {
      title: title.trim(),
      color,
      habitDays,
      status: 'Planned',
    };

    try {
      await onSubmit(habitData);
      onClose();
    } catch (error) {
      console.error('Failed to create habit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50'>
      <div className='bg-white rounded-xl p-6 w-96 shadow-lg max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-center border-b pb-3 mb-4'>
          <h2 className='text-lg font-semibold text-gray-800'>Create a habit</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-800 text-xl cursor-pointer '
          >
            <X size={20} />
          </button>
        </div>

        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Title</label>
          <input
            type='text'
            placeholder='Enter habit title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400'
          />
        </div>

        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Choose days</label>
          <div className='grid grid-cols-2 gap-2'>
            {days.map((day) => (
              <button
                key={day.code}
                onClick={() => toggleDay(day.code)}
                className={`p-2 text-sm rounded-lg border transition-colors cursor-pointer ${
                  selectedDays.includes(day.code)
                    ? 'bg-yellow-400 text-white border-yellow-400'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {day.name}
              </button>
            ))}
          </div>
        </div>

        <div className='mb-6'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Choose color</label>
          <div className='flex flex-wrap gap-2'>
            {colors.map((colorOption) => (
              <button
                key={colorOption}
                onClick={() => setColor(colorOption)}
                className={`w-8 h-8 rounded-full border-2 cursor-pointer ${
                  color === colorOption ? 'border-gray-800' : 'border-gray-300'
                }`}
                style={{ backgroundColor: colorOption }}
              />
            ))}
          </div>
        </div>

        <div className='flex justify-end space-x-3'>
          <button
            onClick={onClose}
            className='px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 cursor-pointer '
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || isLoading || selectedDays.length === 0}
            className='px-4 py-2 rounded-lg bg-yellow-400 text-white hover:bg-yellow-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isLoading ? 'Creating...' : 'Create Habit'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateHabitModal;
