import { format } from 'date-fns';
import type { Task, TaskStatus } from '../lib/types';
import { Pencil, Trash2 } from 'lucide-react';

type TasksListProps = {
  tasks: Task[];
  onDeleteTask: (taskId: number) => void;
  onUpdateTaskStatus: (taskId: number, status: TaskStatus) => void;
  onEditTask: (taskId: number) => void;
  loading: boolean;
};

const taskStatuses: TaskStatus[] = ['Pending', 'In Progress', 'Completed', 'Canceled'];

export default function TasksList({
  tasks,
  onDeleteTask,
  onUpdateTaskStatus,
  onEditTask,
  loading,
}: TasksListProps) {
  return (
    <div className='mt-6 p-4 bg-white border rounded-lg'>
      <h3 className='text-lg font-semibold mb-3'>📋 All Tasks</h3>
      <div className='space-y-2'>
        {tasks.map((task) => (
          <div key={task.id} className='flex items-center justify-between p-3 bg-gray-50 rounded'>
            <div>
              <div className='font-medium'>{task.title}</div>
              <div className='text-xs text-gray-500'>
                {task.dateAssigned && task.dateDue ? (
                  <>
                    Duration: {format(new Date(task.dateAssigned), 'MMM d')} -{' '}
                    {format(new Date(task.dateDue), 'MMM d')}
                  </>
                ) : task.dateDue ? (
                  <>Due: {format(new Date(task.dateDue), 'PPP')}</>
                ) : (
                  'No dates set'
                )}
                {' | '}Status: {task.status} | Category: {task.category}
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <select
                value={task.status}
                onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as TaskStatus)}
                className='border px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer'
                disabled={loading}
              >
                {taskStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button
                onClick={() => onEditTask(task.id)}
                className='text-blue-600 hover:text-blue-800 text-sm cursor-pointer'
                disabled={loading}
                title='Edit Task'
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => onDeleteTask(task.id)}
                className='text-red-600 hover:text-red-800 text-sm cursor-pointer'
                disabled={loading}
                title='Delete Task'
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
