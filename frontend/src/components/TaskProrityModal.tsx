import { useState } from 'react';
import { X } from 'lucide-react';
import type { MatrixTask, ImportanceLevel, UrgencyLevel } from '@/lib/types';

interface TaskPriorityModalProps {
  task: MatrixTask;
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskId: number, importance: ImportanceLevel, urgency: UrgencyLevel) => void;
}

const TaskPriorityModal = ({ task, isOpen, onClose, onSave }: TaskPriorityModalProps) => {
  const [importance, setImportance] = useState<ImportanceLevel>(task.importance);
  const [urgency, setUrgency] = useState<UrgencyLevel>(task.urgency);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(task.id, importance, urgency);
    onClose();
  };

  const handleCancel = () => {
    setImportance(task.importance);
    setUrgency(task.urgency);
    onClose();
  };

  const getQuadrantInfo = (imp: ImportanceLevel, urg: UrgencyLevel) => {
    if (imp === 'high' && urg === 'high') return { name: 'DO FIRST', color: 'text-red-600', bg: 'bg-red-50' };
    if (imp === 'high' && urg === 'low') return { name: 'SCHEDULE', color: 'text-green-600', bg: 'bg-green-50' };
    if (imp === 'low' && urg === 'high') return { name: 'DELEGATE', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { name: 'ELIMINATE', color: 'text-gray-600', bg: 'bg-gray-50' };
  };

  const currentQuadrant = getQuadrantInfo(importance, urgency);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Set Task Priority</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task Info */}
        <div className="mb-6 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm text-gray-900">{task.title}</h4>
          {task.description && (
            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          )}
          {task.category && (
            <span className="inline-block bg-gray-200 px-2 py-1 rounded text-xs mt-2">
              {task.category}
            </span>
          )}
        </div>

        {/* Current Quadrant Preview */}
        <div className={`mb-6 p-3 rounded-lg ${currentQuadrant.bg} border`}>
          <p className="text-sm text-gray-700">This task will be placed in:</p>
          <p className={`font-bold text-lg ${currentQuadrant.color}`}>
            {currentQuadrant.name}
          </p>
        </div>

        {/* Importance Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Importance Level
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="importance"
                value="high"
                checked={importance === 'high'}
                onChange={(e) => setImportance(e.target.value as ImportanceLevel)}
                className="mr-3"
              />
              <div>
                <span className="font-medium text-red-600">High Importance</span>
                <p className="text-xs text-gray-600">
                  Critical tasks that align with your goals and values
                </p>
              </div>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="importance"
                value="low"
                checked={importance === 'low'}
                onChange={(e) => setImportance(e.target.value as ImportanceLevel)}
                className="mr-3"
              />
              <div>
                <span className="font-medium text-gray-600">Low Importance</span>
                <p className="text-xs text-gray-600">
                  Tasks that don't significantly impact your main objectives
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Urgency Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Urgency Level
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="urgency"
                value="high"
                checked={urgency === 'high'}
                onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                className="mr-3"
              />
              <div>
                <span className="font-medium text-orange-600">High Urgency</span>
                <p className="text-xs text-gray-600">
                  Tasks with tight deadlines or immediate consequences
                </p>
              </div>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="urgency"
                value="low"
                checked={urgency === 'low'}
                onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                className="mr-3"
              />
              <div>
                <span className="font-medium text-gray-600">Low Urgency</span>
                <p className="text-xs text-gray-600">
                  Tasks that can be scheduled for later
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Priority
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskPriorityModal;