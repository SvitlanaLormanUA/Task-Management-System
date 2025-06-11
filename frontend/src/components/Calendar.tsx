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

// Mock types for demo
type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Canceled';
type TaskCategory = 'Work' | 'Home' | 'Study' | 'Other';

type Task = {
    id: number;
    title: string;
    description?: string;
    dateAssigned: string;
    dateDue?: string | null;
    status: TaskStatus;
    category: TaskCategory;
    userId: number;
};

type CalendarEvent = {
    date: Date;
    title: string;
    status: TaskStatus;
    category?: TaskCategory;
};

// Mock tasks with different date formats to test
const mockTasks: Task[] = [
    {
        id: 1,
        title: "Підготувати презентацію",
        description: "Створити презентацію для зустрічі",
        dateAssigned: "2025-06-10T10:00:00Z",
        dateDue: "2025-06-15T23:59:59Z",
        status: "Pending",
        category: "Work",
        userId: 1
    },
    {
        id: 2,
        title: "Купити продукти",
        dateAssigned: "2025-06-10T10:00:00Z",
        dateDue: "2025-06-12T18:00:00Z",
        status: "In Progress",
        category: "Home",
        userId: 1
    },
    {
        id: 3,
        title: "Вивчити React",
        dateAssigned: "2025-06-08T10:00:00Z",
        dateDue: "2025-06-20T23:59:59Z",
        status: "In Progress",
        category: "Study",
        userId: 1
    },
    {
        id: 4,
        title: "Завершене завдання",
        dateAssigned: "2025-06-05T10:00:00Z",
        dateDue: "2025-06-10T23:59:59Z",
        status: "Completed",
        category: "Work",
        userId: 1
    },
    {
        id: 5,
        title: "Завдання без дати",
        dateAssigned: "2025-06-08T10:00:00Z",
        dateDue: null,
        status: "Pending",
        category: "Other",
        userId: 1
    }
];

type CalendarProps = {
    tasks: Task[];
};

export default function Calendar({ tasks = mockTasks }: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [debugInfo, setDebugInfo] = useState<string[]>([]);

    useEffect(() => {
        const debug: string[] = [];
        debug.push(`🔍 Calendar received ${tasks.length} tasks`);
        
        // Детальна діагностика кожного завдання
        tasks.forEach((task, index) => {
            debug.push(`\n📋 Task ${index + 1}:`);
            debug.push(`  - ID: ${task.id}`);
            debug.push(`  - Title: "${task.title}"`);
            debug.push(`  - DateDue: ${task.dateDue || 'null'}`);
            debug.push(`  - Status: ${task.status}`);
            debug.push(`  - Category: ${task.category}`);
            
            if (!task.dateDue) {
                debug.push(`  ❌ Skipped: No dateDue`);
                return;
            }
            
            const dueDate = new Date(task.dateDue);
            const isValidDate = !isNaN(dueDate.getTime());
            
            debug.push(`  - Parsed date: ${dueDate.toString()}`);
            debug.push(`  - Is valid: ${isValidDate ? '✅' : '❌'}`);
            
            if (isValidDate) {
                debug.push(`  - Formatted: ${format(dueDate, 'yyyy-MM-dd HH:mm')}`);
            }
        });
        
        // Ensure tasks is always an array
        const safeTasks = Array.isArray(tasks) ? tasks : [];
        debug.push(`\n📊 Safe tasks array length: ${safeTasks.length}`);
        
        const newEvents: CalendarEvent[] = safeTasks
            .filter(task => {
                // Check if task has a valid dateDue
                if (!task.dateDue) {
                    debug.push(`⚠️ Task "${task.title}" has no dateDue`);
                    return false;
                }
                
                const dueDate = new Date(task.dateDue);
                const isValidDate = !isNaN(dueDate.getTime());
                
                if (!isValidDate) {
                    debug.push(`❌ Task "${task.title}" has invalid dateDue: ${task.dateDue}`);
                    return false;
                }
                
                debug.push(`✅ Task "${task.title}" will be added to calendar`);
                return true;
            })
            .map(task => {
                const event: CalendarEvent = {
                    date: new Date(task.dateDue as string),
                    title: task.title,
                    status: task.status || 'Pending',
                    category: task.category || 'Other',
                };
                return event;
            });
            
        debug.push(`\n🎯 Final events count: ${newEvents.length}`);
        setDebugInfo(debug);
        setEvents(newEvents);
    }, [tasks]);

    const renderHeader = () => (
        <div className="flex justify-between items-center mb-4">
            <button 
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-2 hover:bg-gray-100 rounded"
            >
                ◄
            </button>
            <h2 className="text-xl font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
            <button 
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-2 hover:bg-gray-100 rounded"
            >
                ►
            </button>
        </div>
    );

    const renderDays = () => {
        const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
        return (
            <div className="grid grid-cols-7 text-center font-medium mb-2">
                {days.map(day => (
                    <div key={day} className="p-2 text-gray-600">{day}</div>
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
                        className={`border h-24 p-1 cursor-pointer hover:bg-gray-50 ${
                            !isSameMonth(day, monthStart) ? 'bg-gray-100 text-gray-400' : 'bg-white'
                        }`}
                        onClick={() => {
                            setSelectedDate(cloneDay);
                            setIsOpen(true);
                        }}
                    >
                        <div className="text-sm font-medium">{format(day, 'd')}</div>
                        <div className="mt-1 space-y-1">
                            {dayEvents.slice(0, 2).map((e, i) => (
                                <div 
                                    key={i} 
                                    className={`text-xs px-1 py-0.5 rounded truncate ${
                                        e.status === 'Completed' ? 'bg-green-200 text-green-800' :
                                        e.status === 'In Progress' ? 'bg-blue-200 text-blue-800' :
                                        e.status === 'Canceled' ? 'bg-gray-200 text-gray-800' :
                                        'bg-yellow-200 text-yellow-800'
                                    }`}
                                    title={e.title}
                                >
                                    {e.title}
                                </div>
                            ))}
                            {dayEvents.length > 2 && (
                                <div className="text-xs text-gray-500">
                                    +{dayEvents.length - 2} more
                                </div>
                            )}
                        </div>
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

    const selectedDateEvents = selectedDate ? 
        events.filter(e => isSameDay(e.date, selectedDate)) : [];

    return (
        <div className="max-w-6xl mx-auto mt-4 p-4">
            {/* Для нас */}
            {/* <div className="mb-6 p-4 bg-gray-50 border rounded-lg">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-700">🔧 Debug Information</h3>
                    <div className="text-sm bg-blue-100 px-3 py-1 rounded-full">
                        Events: {events.length} | Tasks: {tasks.length}
                    </div>
                </div>
                <div className="max-h-40 overflow-y-auto bg-white p-3 rounded border font-mono text-xs">
                    {debugInfo.map((line, index) => (
                        <div key={index} className={line.includes('❌') ? 'text-red-600' : 
                                                   line.includes('✅') ? 'text-green-600' :
                                                   line.includes('⚠️') ? 'text-yellow-600' :
                                                   line.includes('🎯') ? 'text-blue-600 font-bold' :
                                                   'text-gray-700'}>
                            {line}
                        </div>
                    ))}
                </div>
            </div> */}

            {/* Calendar */}
            <div className="border rounded-lg shadow bg-white p-4">
                <div className="mb-4 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        Displaying {events.length} task(s) on calendar
                    </div>
                    <div className="text-xs text-gray-500">
                        Current month: {format(currentMonth, 'MMMM yyyy')}
                    </div>
                </div>
                
                {renderHeader()}
                {renderDays()}
                {renderCells()}

                {/* Quick Add Event Modal */}
                {isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                            <h3 className="text-lg font-medium mb-4">
                                {selectedDate && format(selectedDate, 'PPP')}
                            </h3>
                            
                            {selectedDateEvents.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium mb-2">Existing Tasks:</h4>
                                    <div className="space-y-2">
                                        {selectedDateEvents.map((event, i) => (
                                            <div 
                                                key={i}
                                                className={`p-2 rounded text-sm ${
                                                    event.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                    event.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                                    event.status === 'Canceled' ? 'bg-gray-100 text-gray-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}
                                            >
                                                <div className="font-medium">{event.title}</div>
                                                <div className="text-xs">
                                                    {event.status} • {event.category}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            <div>
                                <h4 className="text-sm font-medium mb-2">Add Quick Event:</h4>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="Event name"
                                    className="w-full border px-3 py-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="flex justify-end space-x-2">
                                    <button 
                                        onClick={() => {
                                            setIsOpen(false);
                                            setTitle('');
                                        }} 
                                        className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddEvent}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 text-sm rounded transition"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Tasks List for Reference */}
            <div className="mt-6 p-4 bg-white border rounded-lg">
                <h3 className="text-lg font-semibold mb-3">📋 All Tasks (for reference)</h3>
                <div className="space-y-2">
                    {tasks.map((task, index) => (
                        <div key={task.id || index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                                <div className="font-medium">{task.title}</div>
                                <div className="text-xs text-gray-500">
                                    Due: {task.dateDue ? format(new Date(task.dateDue), 'PPP') : 'No due date'} | 
                                    Status: {task.status} | 
                                    Category: {task.category}
                                </div>
                            </div>
                            <div className={`px-2 py-1 rounded text-xs ${
                                task.status === 'Completed' ? 'bg-green-200 text-green-800' :
                                task.status === 'In Progress' ? 'bg-blue-200 text-blue-800' :
                                task.status === 'Canceled' ? 'bg-gray-200 text-gray-800' :
                                'bg-yellow-200 text-yellow-800'
                            }`}>
                                {task.status}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}