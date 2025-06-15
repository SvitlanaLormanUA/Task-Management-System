import Header from '@/components/Header.tsx';
import Square from '@/components/Square';
import Calendar from '@/components/Calendar.tsx';

const CalendarPage = () => {
  return (
    <div className='flex bg-blue-100 min-h-screen'>
      <Header className='absolute top-4 left-4 z-10 md:top-6 md:left-6' />

      {/* Sidebar */}
      <aside className='w-24 bg-yellow-100 flex flex-col justify-center items-center py-4 shadow-md'>
        <div className='space-y-4 text-xs text-gray-700'>
          <div className='flex flex-col items-center gap-1'>
            <span className='border rounded px-2 py-1'>Home</span>
          </div>
          <div className='flex flex-col items-center gap-1'>
            <span className='border rounded px-2 py-1'>Lectures</span>
          </div>
          <div className='flex flex-col items-center gap-1'>
            <span className='border rounded px-2 py-1'>Seminars</span>
          </div>
        </div>
        <div className='w-36 h-36 rounded-full overflow-hidden mb-4'>
          <img src='./images/bunny.webp' alt='Character' className='w-full h-full object-cover' />
        </div>

        <button
          onClick={() => window.history.back()}
          className='flex items-center gap-2 text-gray-700 hover:text-black mb-4'
        >
          <span role='img' aria-label='back'>
            ←
          </span>
          Back
        </button>
      </aside>

      {/* Main Content */}
      <div className='flex-1 flex flex-col'>
        {/* Top menu using Square */}
        <div className='flex justify-center gap-4 mb-4 bg-yellow-100 py-4'>
          {[
            { title: 'habit tracker', color: '#FAFAF5', path: '/habit-tracker' },
            { title: 'matrix', color: '#FBD443', path: '/matrix' },
            //  {title: "quick notes", color: "#FEF9F5"},
            { title: 'to-do lists', color: '#FFF7D8', path: '/todo-list' },
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
        <div className='min-h-screen bg-blue-100'>
          <Calendar tasks={[]} />
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
