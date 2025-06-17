import { useState } from 'react';
import { X } from 'lucide-react';
import { useApiClient } from '@/api/useApiClient';
import type { CreateTaskData } from '@/lib/types';

interface CreateTaskModalProps {
  onClose: () => void;
  onTaskCreated: () => void;
}

function CreateToDoModal({ onClose, onTaskCreated }: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal');
  const [dateDue, setDateDue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const apiClient = useApiClient();

  const handleSubmit = async () => {
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      const taskData: CreateTaskData = {
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        dateDue: dateDue || undefined,
        status: 'Pending'
      };

      const response = await apiClient.post('http://127.0.0.1:5000/tasks', taskData);
      
      if (response.ok) {
        onTaskCreated();
        onClose();
        // Reset form
        setTitle('');
        setDescription('');
        setCategory('Personal');
        setDateDue('');
      } else {
        console.error('Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-[#fdfcf9] rounded-3xl shadow-lg w-96 overflow-hidden">
        <div className="bg-purple-100 px-4 py-2 flex items-center justify-between">
          <span className="font-medium">Create a task</span>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Title *</label>
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 border rounded-md px-2 py-1"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              placeholder="Task description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 border rounded-md px-2 py-1 h-20 resize-none"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mt-1 border rounded-md px-2 py-1"
              disabled={isLoading}
            >
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="KMA">KMA</option>
              <option value="School">School</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Due Date</label>
            <input
              type="datetime-local"
              value={dateDue}
              onChange={(e) => setDateDue(e.target.value)}
              className="w-full mt-1 border rounded-md px-2 py-1"
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button 
              onClick={onClose} 
              className="px-4 py-1 border rounded-md"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-1 bg-black text-white rounded-md disabled:opacity-50"
              disabled={isLoading || !title.trim()}
            >
              {isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateToDoModal;