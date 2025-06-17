import { useState } from 'react';
import Header from '@/components/Header.tsx';
import Square from '@/components/Square';
import MatrixQuadrant from '@/components/MatrixQuadrant';
import TaskPriorityModal from '@/components/TaskProrityModal';
import { useMatrixTasks } from '@/lib/useMatrixTasks';
import { QUADRANTS } from '@/lib/types';
import { getTasksByQuadrant } from '@/lib/matrixUtils';
import type { MatrixTask, ImportanceLevel, UrgencyLevel } from '@/lib/types';

const MatrixPage = () => {
  const { tasks, loading, error, updateTaskStatus, updateTaskPriority, getTaskStats } =
    useMatrixTasks();

  const [editingTask, setEditingTask] = useState<MatrixTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditTask = (task: MatrixTask) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSavePriority = async (
    taskId: number,
    importance: ImportanceLevel,
    urgency: UrgencyLevel,
  ) => {
    const success = await updateTaskPriority(taskId, importance, urgency);
    if (success) {
      setIsModalOpen(false);
      setEditingTask(null);
    }
  };

  const handleToggleTask = async (taskId: number, newStatus: string) => {
    await updateTaskStatus(taskId, newStatus);
  };

  const stats = getTaskStats();

  if (loading) {
    return (
      <div className='flex bg-blue-100 min-h-screen dark:bg-[#4682b4] items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4'></div>
          <p className='text-gray-700'>Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex bg-blue-100 min-h-screen dark:bg-[#4682b4] items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-600 mb-4'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='flex bg-blue-100 min-h-screen dark:bg-[#4682b4]'>
      <Header className='absolute top-4 left-4 z-10 md:top-6 md:left-6' />

      {/* Sidebar */}
      <aside className='w-32 bg-yellow-100 flex flex-col justify-center items-center py-4 shadow-md'>
        <div className='space-y-2 text-xs text-gray-700 text-center mb-4'>
          <div className='bg-white p-2 rounded-lg shadow-sm'>
            <p className='font-semibold'>Total: {stats.total}</p>
            <p className='text-green-600'>Done: {stats.completed}</p>
            <p className='text-orange-600'>Pending: {stats.pending}</p>
          </div>

          <div className='bg-white p-2 rounded-lg shadow-sm'>
            <p className='font-semibold text-xs mb-1'>By Quadrant:</p>
            <p className='text-red-600'>Do First: {stats.byQuadrant.doFirst}</p>
            <p className='text-green-600'>Schedule: {stats.byQuadrant.schedule}</p>
            <p className='text-yellow-600'>Delegate: {stats.byQuadrant.delegate}</p>
            <p className='text-gray-600'>Eliminate: {stats.byQuadrant.eliminate}</p>
          </div>
        </div>

        <div className='w-24 h-24 rounded-full overflow-hidden mb-4'>
          <img src='./images/bunny.webp' alt='Character' className='w-full h-full object-cover' />
        </div>

        <button
          onClick={() => (window.location.href = '/')}
          className='flex items-center gap-2 text-gray-700 hover:text-black text-sm cursor-pointer transition-colors'
        >
          <span role='img' aria-label='back'>
            ←
          </span>
          Back
        </button>
      </aside>

      {/* Main Content */}
      <div className='flex-1 flex flex-col'>
        <div className='flex justify-center gap-4 mb-4 bg-yellow-100 py-4'>
          {[
            { title: 'calendar', color: '#FAFAF5', path: '/calendar' },
            { title: 'to-do lists', color: '#FFF7D8', path: '/todo-list' },
            { title: 'habit tracker', color: '#FEF9F5', path: '/habit-tracker' },
            { title: 'goals | beta', color: '#F3D9DA', path: '/error' },
          ].map((tab) => (
            <Square
              key={tab.title}
              title={tab.title}
              color={tab.color || 'white'}
              className='w-36 h-24 p-4'
              onClick={() => (window.location.href = tab.path)}
            />
          ))}
        </div>
        <div className='flex-1 p-4 overflow-y-auto justify-center items-center'>
          <div className='grid grid-cols-2 gap-4'>
            {QUADRANTS.map((quadrant) => {
              // Provide a default urgency level or get it from quadrant if available
              const quadrantTasks = getTasksByQuadrant(
                tasks,
                quadrant.importance,
                quadrant.urgency,
              );
              return (
                <MatrixQuadrant
                  key={quadrant.id}
                  quadrant={quadrant}
                  tasks={quadrantTasks}
                  onEditTask={handleEditTask}
                  onToggleTask={handleToggleTask}
                />
              );
            })}
          </div>
          {editingTask && (
            <TaskPriorityModal
              task={editingTask}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={() =>
                handleSavePriority(editingTask.id, editingTask.importance, editingTask.urgency)
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default MatrixPage;
