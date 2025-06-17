import { CheckSquare, Square as SquareIcon, Calendar, Edit3 } from 'lucide-react';
import type { MatrixTask } from '@/lib/types';
import { formatDate, isTaskOverdue } from '@/lib/matrixUtils';

interface TaskCardProps {
  task: MatrixTask;
  onToggle: (taskId: number, newStatus: string) => void;
  onEdit: (task: MatrixTask) => void;
}

const TaskCard = ({ task, onToggle, onEdit }: TaskCardProps) => {
  const isCompleted = task.status === 'Completed';
  const isOverdue = isTaskOverdue(task);

  const handleToggle = () => {
    const newStatus = isCompleted ? 'Pending' : 'Completed';
    onToggle(task.id, newStatus);
  };

  return (
    <div className={`p-2 mb-2 bg-white rounded-lg shadow-sm border ${isOverdue ? 'border-red-200' : 'border-gray-200'} text-lg hover:shadow-md transition-shadow`}>
      <div className="flex mt-2 items-start gap-2">
        <button 
          onClick={handleToggle}
          className="mt-0.5 flex-shrink-0 cursor-pointer hover:bg-gray-100 rounded p-1 transition-colors"
        >
          {isCompleted ? (
            <CheckSquare className="size-4 text-green-600" />
          ) : (
            <SquareIcon className="size-4 text-gray-400 hover:text-gray-600" />
          )}
        </button>
        
        <div className="flex-1 min-w-10 min-h-20">
          <h4 className={`font-medium text-md leading-tight ${
            isCompleted ? 'line-through text-gray-500' : 
            isOverdue ? 'text-red-600' : 'text-gray-900'
          }`}>
            {task.title}
          </h4>
          
          {task.description && (
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{task.description}</p>
          )}
          
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {task.category && (
              <span className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                {task.category}
              </span>
            )}
            {task.dateDue && (
              <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                <Calendar className="w-3 h-3" />
                <span>{formatDate(task.dateDue)}</span>
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={() => onEdit(task)}
          className="text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0"
          title="Edit task priority"
        >
          <Edit3 className="size-4 mr-2 cursor-pointer" />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;