import Square from '@/components/Square';
import Header from '@/components/Header';

const MainPage = () => (
    <div className="min-h-screen bg-blue-100 relative p-4 flex items-center justify-center h-full" style={{
        minHeight: '100vh',
        backgroundImage: 'url(./images/mainpage.svg)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right',
        backgroundSize: 'contain'
    }}>
        <Header className="absolute top-4 left-4 z-10 md:top-6 md:left-6"/>
        <div className="flex flex-row md:flex-col justify-center gap-8 w-full max-w-4xl grow">
            <div className="flex flex-col md:flex-row justify-center gap-8">
                <Square title="calendar" color="#FAFAF5" onClick={() => window.location.href = '/calendar'}>
                    <img src="./images/calendar.webp" alt="Calendar Icon" className='mt-4'/>
                </Square>
                <Square title="to-do list" color="#FAFAF5" onClick={() => window.location.href = '/todo-list'}>
                    <img src="./images/to-do.webp" alt="To-Do List" className='mt-4'/>
                </Square>
                <Square title="habit tracker" color="#FFF7D8" onClick={() => window.location.href = '/habit-tracker'}>
                    <img src="./images/habits.webp" alt="Habit Traker" className='mt-4'/>
                </Square>
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-8">
                <Square title="notes | beta" color="#FEF9F5">
                    <img src="./images/notes.webp" alt="Quick Notes" className='mt-4'/>
                </Square>
                <Square title="eisenhower matrix" color="#FBD443" onClick={() => window.location.href = '/matrix'}>
                    <img src="./images/matrix.webp" alt="Eisenhower Matrix" className='mt-8 ml-8 size-18'/>
                </Square>
                <Square title="goals | beta" color="#F3D9DA">
                    <img src="./images/planet.webp" alt="Goals" className='mt-4'/>
                </Square>
            </div>
        </div>
    </div>
);

export default MainPage;