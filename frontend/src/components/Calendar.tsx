import { useState, useEffect } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    addMonths,
    subMonths,
    isSameMonth,
    isSameDay,
} from 'date-fns';
import { Dialog } from '@headlessui/react';
import type { Task, TaskStatus, TaskCategory } from '../lib/types'; 

type CalendarEvent = {
    date: Date;
    title: string;
    status: TaskStatus;
    category?: TaskCategory;
};

type CalendarProps = {
    tasks: Task[];
};

export default function Calendar({ tasks }: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    // Map backend tasks to events
    useEffect(() => {
        const newEvents: CalendarEvent[] = tasks
            .filter(task => task.dateDue) // Only include tasks with dateDue
            .map(task => ({
                date: new Date(task.dateDue as string),
                title: task.title,
                status: task.status,
                category: task.category
            }));
        setEvents(newEvents);
    }, [tasks]);

    const renderHeader = () => (
        <div className="flex justify-between items-center mb-4">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>◄</button>
            <h2 className="text-xl font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>➤</button>
        </div>
    );

    const renderDays = () => {
        const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
        return (
            <div className="grid grid-cols-7 text-center font-medium">
                {days.map(day => (
                    <div key={day}>{day}</div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

        const rows = [];
        let days = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const cloneDay = day;
                const dayEvents = events.filter(e => isSameDay(e.date, cloneDay));

                days.push(
                    <div
                        key={day.toString()}
                        className={`border h-20 p-1 cursor-pointer ${!isSameMonth(day, monthStart) ? 'bg-gray-100 text-gray-400' : ''}`}
                        onClick={() => {
                            setSelectedDate(cloneDay);
                            setIsOpen(true);
                        }}
                    >
                        <div className="text-sm">{format(day, 'd')}</div>
                        {dayEvents.map((e, i) => (
                            <div 
                                key={i} 
                                className={`text-xs mt-1 truncate px-1 rounded ${
                                    e.status === 'Completed' ? 'bg-green-200' :
                                    e.status === 'In Progress' ? 'bg-blue-200' :
                                    e.status === 'Canceled' ? 'bg-gray-200' :
                                    'bg-yellow-200'
                                }`}
                            >
                                {e.title}
                            </div>
                        ))}
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(<div key={day.toString()} className="grid grid-cols-7">{days}</div>);
            days = [];
        }

        return <div>{rows}</div>;
    };

    const handleAddEvent = () => {
        if (selectedDate && title.trim()) {
            setEvents([...events, { 
                date: selectedDate, 
                title,
                status: 'Pending' as TaskStatus,
                category: 'Work' as TaskCategory
            }]);
            setTitle('');
            setIsOpen(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-4 border rounded-lg shadow bg-white">
            {renderHeader()}
            {renderDays()}
            {renderCells()}

            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center">
                    <Dialog.Panel className="bg-white p-6 rounded shadow-md w-80">
                        <Dialog.Title className="text-lg font-medium mb-2">Create Event</Dialog.Title>
                        <p className="text-sm mb-2">{selectedDate && format(selectedDate, 'PPP')}</p>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Event name"
                            className="w-full border px-2 py-1 mb-3 rounded"
                        />
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setIsOpen(false)} className="text-sm text-gray-500">
                                Cancel
                            </button>
                            <button
                                onClick={handleAddEvent}
                                className="bg-[#FBD443] text-white px-3 py-1 text-sm rounded"
                            >
                                Add
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
}