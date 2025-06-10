import { Component, useState } from 'react';
import {
  CheckSquare,
  Clock,
  Calendar,
  AlertCircle,
  Square,
  X,
} from 'lucide-react';

class Task extends Component<{ label: any, checked: any, dueTime: any, dueDate: any, isOverdue: any }> {
  render() {
    let { label, checked, dueTime, dueDate, isOverdue } = this.props;
    return (
      <div className="flex items-center gap-2 text-sm">
        <div className="text-red-600">
          {checked ? (
            <CheckSquare className="w-4 h-4" />
          ) : (
            <Square className="w-4 h-4" />
          )}
        </div>
        <span className={`${isOverdue ? 'text-red-600' : ''}`}>{label}</span>
        {isOverdue && (
          <AlertCircle className="w-4 h-4 text-red-600 ml-1" />
        )}
      </div>
    );
  }
}

class CreateTaskModal extends Component<{ onClose: any }> {
  render() {
    let { onClose } = this.props;
    const [repeat, setRepeat] = useState(false);
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-[#fdfcf9] rounded-3xl shadow-lg w-96 overflow-hidden">
          <div className="bg-purple-100 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4" />
              <span className="font-medium">Create a task</span>
            </div>
            <button onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                placeholder="Title"
                className="w-full mt-1 border rounded-md px-2 py-1"
              />
            </div>

            <div className="flex gap-2 text-purple-600 text-sm">
              <button className="bg-gray-100 px-3 py-1 rounded-md">Jun 10, 2024</button>
              <button className="bg-gray-100 px-3 py-1 rounded-md">9:41 AM</button>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Repeat</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={repeat}
                    onChange={() => setRepeat(!repeat)}
                  />
                  <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-black transition-all"></div>
                  <div
                    className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                </label>
              </div>

              {repeat && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {['day', 'week', 'month', 'custom'].map((opt) => (
                    <button
                      key={opt}
                      className="border border-gray-400 rounded-md px-3 py-1 text-sm"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={onClose} className="px-4 py-1 border rounded-md">Cancel</button>
              <button className="px-4 py-1 bg-black text-white rounded-md">Ok</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const MacroCard = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl p-4 shadow w-64 border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-semibold">Macro 2</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setShowModal(true)}
          >
            +
          </button>
        </div>

        <div className="space-y-2">
          <Task label="Lecture 3" checked={true} />
          <Task label="HW2" checked={false} />
          <Task label="HW1" checked={false} />
        </div>

        <div className="flex justify-between items-center border-t border-gray-200 pt-3 mt-3 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span className="text-red-600">1:23</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span className="text-red-600">01.01.25</span>
          </div>
        </div>
      </div>

      {showModal && <CreateTaskModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default MacroCard;

