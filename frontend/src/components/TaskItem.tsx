import { CheckSquare, Square, Trash2, Calendar, Edit3 } from 'lucide-react';
import type { Task } from '@/lib/types';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: number, newStatus: string) => void;
  onDelete: (taskId: number) => void;
  onEdit: (task: Task) => void;
}

function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const isCompleted = task.status === 'Completed';
  const isOverdue = task.dateDue && new Date(task.dateDue) < new Date() && !isCompleted;

  const handleToggle = () => {
    const newStatus = isCompleted ? 'Pending' : 'Completed';
    onToggle(task.id, newStatus);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`p-3 border rounded-lg bg-white shadow-sm ${isOverdue ? 'border-red-200' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <button onClick={handleToggle} className="mt-0.5">
            {isCompleted ? (
              <CheckSquare className="w-5 h-5 text-green-600" />
            ) : (
              <Square className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
          
          <div className="flex-1">
            <h3 className={`font-medium ${isCompleted ? 'line-through text-gray-500' : isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              {task.category && (
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {task.category}
                </span>
              )}
              {task.dateDue && (
                <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600' : ''}`}>
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(task.dateDue)}</span>
                </div>
              )}
              <span className={`px-2 py-1 rounded text-xs ${
                task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {task.status}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
            title="Edit task"
          >
            <Edit3 className="size-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
            title="Delete task"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;