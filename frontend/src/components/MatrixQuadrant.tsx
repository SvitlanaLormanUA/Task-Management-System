import TaskCard from './TaskCard';
import type { Quadrant, MatrixTask } from '@/lib/types';

interface MatrixQuadrantProps {
  quadrant: Quadrant;
  tasks: MatrixTask[];
  onToggleTask: (taskId: number, newStatus: string) => void;
  onEditTask: (task: MatrixTask) => void;
}

const MatrixQuadrant = ({ quadrant, tasks, onToggleTask, onEditTask }: MatrixQuadrantProps) => {
  return (
    <div className={`w-full flex flex-col p-4 ${quadrant.color} border border-gray-300 p-4 rounded-xl`}>
      <div className="text-center mb-3">
        <h3 className="font-bold text-gray-800 text-lg">{quadrant.title}</h3>
        <p className="text-xs text-gray-600 mt-1">{quadrant.description}</p>
        <span className="text-xs text-gray-500">({tasks.length} tasks)</span>
      </div>
      
      <div className="flex-1 overflow-y-auto min-h-30">
        {tasks.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-600 text-xs">No tasks in this quadrant</p>
            <p className="text-gray-500 text-xs mt-1">
              {quadrant.id === 'do-first' && 'Focus on urgent and important tasks'}
              {quadrant.id === 'schedule' && 'Plan important tasks for later'}
              {quadrant.id === 'delegate' && 'Consider delegating these tasks'}
              {quadrant.id === 'eliminate' && 'Consider removing these tasks'}
            </p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={onToggleTask}
              onEdit={onEditTask}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MatrixQuadrant;