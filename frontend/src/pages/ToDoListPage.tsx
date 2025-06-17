import { useState } from 'react';
import Header from '@/components/Header.tsx';
import Square from '@/components/Square';
import ToDoCard from '@/components/ToDoCard';
import CreateToDoModal from '@/components/CreateToDoModal';

const ToDoListPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTaskCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex bg-yellow-50 min-h-screen">
      {/* Floating "+" button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#FBD443] text-white text-3xl flex items-center justify-center shadow-lg hover:bg-[#FBD443] transition z-40 cursor-pointer"
      >
        +
      </button>

      {isModalOpen && (
        <CreateToDoModal
          onClose={() => setIsModalOpen(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}

      <Header className="absolute top-4 left-4 z-10 md:top-6 md:left-6" />

      {/* Sidebar */}
      <aside className="w-24 bg-yellow-100 flex flex-col justify-center items-center py-4 shadow-md">
        <div className="w-36 h-36 rounded-full overflow-hidden mb-4">
          <img src="./images/bunny.webp" alt="Character" className="w-full h-full object-cover" />
        </div>
        <button
          onClick={() => window.location.href = '/'}
          className="flex items-center gap-2 text-gray-700 hover:text-black mb-4 cursor-pointer transition-colors"
        >
          <span role="img" aria-label="back">←</span>
          Back
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top menu using Square */}
        <div className="flex justify-center gap-4 mb-4 bg-yellow-100 py-4">
          {[
            { title: 'calendar', color: '#FAFAF5', path: '/calendar' },
            { title: 'matrix', color: '#FBD443', path: '/matrix' },
            { title: 'habit-tracker', color: '#FFF7D8', path: '/habit-tracker' },
            { title: 'goals | beta', color: '#F3D9DA', path: '/error' },
          ].map((tab) => (
            <Square
              key={tab.title}
              title={tab.title}
              color={tab.color || 'white'}
              className="w-36 h-24 p-4"
              onClick={() => window.location.href = tab.path}
            />
          ))}
        </div>
        
        <div className="p-4" key={refreshKey}>
          <ToDoCard />
        </div>
      </div>
    </div>
  );
};

export default ToDoListPage;