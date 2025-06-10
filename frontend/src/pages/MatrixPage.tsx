import Header from '@/components/Header.tsx';
import Square from '@/components/Square';
import {
  CheckSquare,
  Clock,
  Calendar,
  AlertCircle,
  X,
} from 'lucide-react';


const MatrixPage = () => {


  return (
    <div className="flex bg-blue-100 min-h-screen">


      <Header className="absolute top-4 left-4 z-10 md:top-6 md:left-6" />

      {/* Sidebar */}
      <aside className="w-24 bg-yellow-100 flex flex-col justify-center items-center py-4 shadow-md">
        <div className="space-y-4 text-xs text-gray-700">
          <p>Lecture macro</p>
          <p>Play with dog</p>
          <p>HW</p>
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
            { title: 'to-do lists', color: '#FFF7D8' },
            { title: 'habit tracker ', color: '#FEF9F5' },
            // { title: 'quick notes | beta', color: '#FEF9F5' },
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

        <div className="relative flex flex-col bg-blue-100 p-4">
          {/* Background overlay */}
          <div className="absolute inset-0 opacity-30"></div>
          <div className="flex flex-1 relative z-10">
            {/* Important & Urgent */}
            <div
              className="w-1/2 flex flex-col justify-center items-center bg-yellow-200/80 border-r border-b border-gray-300 p-24 rounded-xl">

            </div>
            {/* Unimportant & Urgent */}
            <div
              className="w-1/2 flex flex-col justify-center items-center bg-yellow-300/80 border-b border-gray-300 p-24 rounded-xl">

            </div>
          </div>
          <div className="flex flex-1 relative z-10">
            {/* Important & Unurgent */}
            <div
              className="w-1/2 flex flex-col justify-center items-center bg-yellow-100/80 border-r border-gray-300 p-24 rounded-xl">

            </div>
            {/* Unimportant & Unurgent */}
            <div className="w-1/2 flex flex-col justify-center items-center bg-yellow-50/80 p-24 rounded-xl">

            </div>
          </div>
          {/* Vertical Labels */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center">
            <span
              className=" writing-mode-vertical-rl transform origin-center text-gray-600 font-semibold">Important</span>
            <span
              className="mt-2 writing-mode-vertical-rl transform origin-center text-gray-600 font-semibold">Unimportant</span>
          </div>
          {/* Horizontal Labels */}
          <div className="absolute top-4 right-1/2 transform translate-x-1/2 text-gray-600 font-semibold">Urgent</div>
          <div className="absolute bottom-4 right-1/2 transform translate-x-1/2 text-gray-600 font-semibold">Unurgent

          </div>
        </div>

      </div>
    </div>
  );
};

export default MatrixPage;