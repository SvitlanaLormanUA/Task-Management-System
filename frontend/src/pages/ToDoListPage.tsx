import { useState } from 'react';
import Header from '@/components/Header.tsx';
import Square from '@/components/Square';
import ToDoCard from '@/components/ToDoCard.tsx';
import CreateToDoModal from '@/components/CreateToDoModal.tsx';


const ToDoListPage = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex bg-yellow-50 min-h-screen">

      {/* Floating "+" button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#FBD443] text-white text-3xl flex items-center justify-center shadow-lg hover:bg-[#FBD443] transition"
      >
        +
      </button>

      {/* Modal */}
      {isModalOpen && (
        <CreateToDoModal
          onClose={() => setIsModalOpen(false)}
        />
      )}


      <Header className="absolute top-4 left-4 z-10 md:top-6 md:left-6" />


      {/* Sidebar */}
      <aside className="w-24 bg-yellow-100 flex flex-col justify-center items-center py-4 shadow-md">

        <div className="space-y-4 text-xs text-gray-700">
          <div className="flex flex-col items-center gap-1">
            <span className="border rounded px-2 py-1">Completed</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="border rounded px-2 py-1">KMA</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="border rounded px-2 py-1">Work</span>
          </div>
        </div>
        <div className="w-36 h-36 rounded-full overflow-hidden mb-4">
          <img src="./images/bunny.webp" alt="Character" className="w-full h-full object-cover" />
        </div>

        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-700 hover:text-black mb-4"
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
            { title: 'calendar', color: '#FAFAF5' },
            { title: 'matrix', color: '#FBD443' },
          //  { title: 'quick notes', color: '#FEF9F5' },
            { title: 'habit-tracker', color: '#FFF7D8' },
            { title: 'goals | beta', color: '#F3D9DA' },
          ].map((tab) => (
            <Square
              key={tab.title}
              title={tab.title}
              color={tab.color || 'white'}
              className="w-36 h-24 p-4"
            />
          ))}
        </div>

        <div className="p-4">
          <ToDoCard />
        </div>

      </div>
    </div>
  );
};

export default ToDoListPage;