import { format } from 'date-fns';
import { useState } from 'react';
import type { CalendarEvent } from '../lib/types';

type TaskFormProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedDate: Date | null;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  category: string;
  setCategory: (category: string) => void;
  startDate: string;
  setStartDate: (startDate: string) => void;
  endDate: string;
  setEndDate: (endDate: string) => void;
  loading: boolean;
  onAddEvent: () => void;
  selectedDateEvents: CalendarEvent[];
  onDeleteTask: (taskId: number) => void;
  categories: string[];
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
};

export default function TaskForm({
  isOpen,
  setIsOpen,
  selectedDate,
  title,
  setTitle,
  description,
  setDescription,
  category,
  setCategory,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  loading,
  onAddEvent,
  selectedDateEvents,
  onDeleteTask,
  categories,
  onAddCategory,
  onDeleteCategory,
}: TaskFormProps) {
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  if (!isOpen) return null;

  const baseCategories = ['Work', 'Home', 'Study', 'Other'];

  const handleAddCategory = () => {
    const trimmedName = newCategoryName.trim();
    if (trimmedName && !categories.includes(trimmedName)) {
      onAddCategory(trimmedName);
      // Автоматично вибираємо нову категорію після додавання
      setCategory(trimmedName);
      setNewCategoryName('');
      setIsAddingCategory(false);
    }
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    // Не дозволяємо видаляти базові категорії
    if (!baseCategories.includes(categoryToDelete)) {
      onDeleteCategory(categoryToDelete);
      // Якщо видаляємо поточно вибрану категорію, встановлюємо 'Work'
      if (category === categoryToDelete) {
        setCategory('Work');
      }
    }
  };

  // Сортуємо категорії: спочатку базові, потім кастомні за алфавітом
  const sortedCategories = [
    ...baseCategories.filter(cat => categories.includes(cat)),
    ...categories.filter(cat => !baseCategories.includes(cat)).sort()
  ];

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto'>
        <h3 className='text-lg font-medium mb-4'>
          {selectedDate && format(selectedDate, 'PPP')}
        </h3>

        {selectedDateEvents.length > 0 && (
          <div className='mb-4'>
            <h4 className='text-sm font-medium mb-2'>Tasks for this day:</h4>
            <div className='space-y-2'>
              {selectedDateEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-2 rounded text-sm flex justify-between items-center ${
                    event.status === 'Completed'
                      ? 'bg-green-100 text-green-800'
                      : event.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : event.status === 'Canceled'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  <div>
                    <div className='font-medium'>{event.title}</div>
                    <div className='text-xs'>
                      {format(event.startDate, 'MMM d')} - {format(event.endDate, 'MMM d')} •{' '}
                      {event.status} • {event.category}
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteTask(event.id)}
                    className='text-red-600 hover:text-red-800 text-sm cursor-pointer'
                    disabled={loading}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className='text-sm font-medium mb-2'>Create New Task:</h4>

          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Task title *'
            className='w-full border px-3 py-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Description (optional)'
            className='w-full border px-3 py-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none'
          />

          <div className='grid grid-cols-2 gap-2 mb-3'>
            <div>
              <label className='block text-xs text-gray-600 mb-1'>Start Date *</label>
              <input
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className='w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div>
              <label className='block text-xs text-gray-600 mb-1'>End Date *</label>
              <input
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className='w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>

          <div className='mb-3'>
            <div className='flex justify-between items-center mb-1'>
              <label className='block text-xs text-gray-600'>Category *</label>
              <button
                type='button'
                onClick={() => setShowCategoryManager(!showCategoryManager)}
                className='text-xs text-blue-600 hover:text-blue-800'
              >
                {showCategoryManager ? 'Hide' : 'Manage Categories'}
              </button>
            </div>
            
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className='w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              {sortedCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                  {baseCategories.includes(cat) ? ' (default)' : ''}
                </option>
              ))}
            </select>

            {/* Менеджер категорій */}
            {showCategoryManager && (
              <div className='mt-2 p-3 bg-gray-50 rounded border'>
                <h5 className='text-xs font-medium mb-2'>Manage Categories:</h5>
                
                {/* Додавання нової категорії */}
                {!isAddingCategory ? (
                  <button
                    type='button'
                    onClick={() => setIsAddingCategory(true)}
                    className='text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded mb-2'
                  >
                    + Add New Category
                  </button>
                ) : (
                  <div className='flex gap-1 mb-2'>
                    <input
                      type='text'
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder='Category name'
                      className='flex-1 text-xs border px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500'
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                      autoFocus
                    />
                    <button
                      type='button'
                      onClick={handleAddCategory}
                      disabled={!newCategoryName.trim() || categories.includes(newCategoryName.trim())}
                      className='text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded disabled:opacity-50'
                    >
                      ✓
                    </button>
                    <button
                      type='button'
                      onClick={() => {
                        setIsAddingCategory(false);
                        setNewCategoryName('');
                      }}
                      className='text-xs bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded'
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Повідомлення про дублікат */}
                {newCategoryName.trim() && categories.includes(newCategoryName.trim()) && (
                  <div className='text-xs text-red-600 mb-2'>
                    Category "{newCategoryName.trim()}" already exists
                  </div>
                )}

                {/* Список існуючих категорій */}
                <div className='space-y-1'>
                  <div className='text-xs font-medium text-gray-700 mb-1'>Default Categories:</div>
                  {baseCategories.filter(cat => categories.includes(cat)).map((cat) => (
                    <div key={cat} className='flex justify-between items-center text-xs pl-2'>
                      <span className='text-gray-600'>
                        {cat}
                      </span>
                      <span className='text-gray-400 text-xs'>protected</span>
                    </div>
                  ))}
                  
                  {categories.filter(cat => !baseCategories.includes(cat)).length > 0 && (
                    <>
                      <div className='text-xs font-medium text-gray-700 mb-1 mt-2'>Custom Categories:</div>
                      {categories.filter(cat => !baseCategories.includes(cat)).sort().map((cat) => (
                        <div key={cat} className='flex justify-between items-center text-xs pl-2'>
                          <span className='text-gray-800'>{cat}</span>
                          <button
                            type='button'
                            onClick={() => handleDeleteCategory(cat)}
                            className='text-red-600 hover:text-red-800'
                            title={`Delete ${cat} category`}
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className='flex justify-end space-x-2'>
            <button
              onClick={() => {
                setIsOpen(false);
                setTitle('');
                setDescription('');
                setCategory('Work');
                setStartDate('');
                setEndDate('');
                setShowCategoryManager(false);
                setIsAddingCategory(false);
                setNewCategoryName('');
              }}
              className='px-3 py-1 text-sm text-gray-500 hover:text-gray-700'
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={onAddEvent}
              disabled={!title.trim() || !startDate || !endDate || loading}
              className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 text-sm rounded transition disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? '⏳ Creating...' : 'Create Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}