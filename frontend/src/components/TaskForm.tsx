import { format } from 'date-fns';
import type { CalendarEvent } from '../lib/types';
import CategoryManager from './CategoryManager';

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
  categories: string[];
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
  editingTaskId: number | null;
  setEditingTaskId: (id: number | null) => void;
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
  categories,
  onAddCategory,
  onDeleteCategory,
  editingTaskId,
  setEditingTaskId,
}: TaskFormProps) {
  if (!isOpen) return null;

  const isEditing = !!editingTaskId;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto'>
        <h3 className='text-lg font-medium mb-4'>
          {selectedDate && format(selectedDate, 'PPP')} {isEditing ? '(Editing Task)' : ''}
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
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className='text-sm font-medium mb-2'>
            {isEditing ? 'Edit Task' : 'Create New Task'}:
          </h4>

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

          <CategoryManager
            category={category}
            setCategory={setCategory}
            categories={categories}
            onAddCategory={onAddCategory}
            onDeleteCategory={onDeleteCategory}
          />

          <div className='flex justify-end space-x-2'>
            <button
              onClick={() => {
                setIsOpen(false);
                setTitle('');
                setDescription('');
                setCategory('Other');
                setStartDate('');
                setEndDate('');
                setEditingTaskId(null);
              }}
              className='px-3 py-1 text-sm text-gray-500 hover:text-gray-700 cursor-pointer'
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={onAddEvent}
              disabled={!title.trim() || !startDate || !endDate || loading}
              className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 text-sm rounded transition disabled:opacity-50 disabled:cursor-not-allowed'
              style={isEditing ? { cursor: 'pointer' } : undefined}
            >
              {loading
                ? isEditing
                  ? 'Updating...'
                  : 'Creating...'
                : isEditing
                  ? 'Update Task'
                  : 'Create Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
