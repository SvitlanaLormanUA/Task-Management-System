import { useState, useEffect, useCallback } from 'react';
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
  differenceInDays,
} from 'date-fns';
import { useApiClient } from '../api/useApiClient';
import type { Task, TaskStatus, TaskCategory, CalendarEvent } from '../lib/types';
import TaskForm from './TaskForm';
import TasksList from './TaskList';

type CalendarProps = {
  tasks?: Task[];
};

function isWithinInterval(date: Date, interval: { start: Date; end: Date }): boolean {
  return date >= interval.start && date <= interval.end;
}

const createTask = async (
  apiClient: ReturnType<typeof useApiClient>,
  taskData: {
    title: string;
    description?: string;
    dateAssigned?: string;
    dateDue?: string;
    status?: TaskStatus;
    category?: TaskCategory;
  },
): Promise<Task> => {
  const response = await apiClient.post('http://127.0.0.1:5000/tasks', taskData);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error || 'Failed to create task');
  }

  return response.json();
};

const fetchTasks = async (apiClient: ReturnType<typeof useApiClient>): Promise<Task[]> => {
  const response = await apiClient.get('http://127.0.0.1:5000/tasks');

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error || 'Failed to fetch tasks');
  }

  return response.json();
};

const deleteTask = async (
  apiClient: ReturnType<typeof useApiClient>,
  taskId: number,
): Promise<void> => {
  const response = await apiClient.delete(`http://127.0.0.1:5000/tasks/${taskId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error || 'Failed to delete task');
  }
};

const updateTask = async (
  apiClient: ReturnType<typeof useApiClient>,
  taskId: number,
  taskData: Partial<{
    title: string;
    description: string;
    dateAssigned: string;
    dateDue: string;
    status: TaskStatus;
    category: TaskCategory;
  }>,
): Promise<Task> => {
  console.log('Sending update with status:', taskData.status, typeof taskData.status);
  const response = await apiClient.put(`http://127.0.0.1:5000/tasks/${taskId}`, taskData);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error || 'Failed to update task');
  }

  return response.json();
};

export default function Calendar({ tasks }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Work');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>(tasks || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiClient = useApiClient();

  const loadTasksFromAPI = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const apiTasks = await fetchTasks(apiClient);
      setAllTasks(apiTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  useEffect(() => {
    loadTasksFromAPI();
  }, [tasks, loadTasksFromAPI]);

  useEffect(() => {
    const newEvents: CalendarEvent[] = allTasks
      .filter((task) => task.dateAssigned && task.dateDue)
      .map((task) => ({
        startDate: new Date(task.dateAssigned as string),
        endDate: new Date(task.dateDue as string),
        title: task.title,
        status: task.status,
        category: task.category || 'Other',
        id: task.id,
      }))
      .filter((event) => !isNaN(event.startDate.getTime()) && !isNaN(event.endDate.getTime()));

    setEvents(newEvents);
  }, [allTasks]);

  const handleAddEvent = async () => {
    if (!selectedDate || !title.trim() || !startDate || !endDate) return;

    try {
      setLoading(true);
      setError(null);

      const newTaskData = {
        title: title.trim(),
        description: description.trim() || undefined,
        dateAssigned: new Date(startDate).toISOString(),
        dateDue: new Date(endDate).toISOString(),
        status: 'Pending' as TaskStatus,
        category: category,
      };

      const newTask = await createTask(apiClient, newTaskData);
      setAllTasks((prev) => [...prev, newTask]);

      setTitle('');
      setDescription('');
      setCategory('Work');
      setStartDate(''); // Reset to empty
      setEndDate(''); // Reset to empty
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      console.error('Error creating task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      setLoading(true);
      setError(null);
      await deleteTask(apiClient, taskId);
      setAllTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      console.error('Error deleting task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId: number, status: TaskStatus) => {
    try {
      setLoading(true);
      setError(null);
      const updatedTask = await updateTask(apiClient, taskId, { status });
      setAllTasks((prev) => prev.map((task) => (task.id === taskId ? updatedTask : task)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task status');
      console.error('Error updating task status:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => (
    <div className='flex justify-between items-center mb-4'>
      <button
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        className='p-2 hover:bg-gray-100 rounded'
        disabled={loading}
      >
        ◄
      </button>
      <h2 className='text-xl font-semibold'>{format(currentMonth, 'MMMM yyyy')}</h2>
      <button
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        className='p-2 hover:bg-gray-100 rounded'
        disabled={loading}
      >
        ►
      </button>
    </div>
  );

  const renderDays = () => {
    const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    return (
      <div className='grid grid-cols-7 text-center font-medium mb-2'>
        {days.map((day) => (
          <div key={day} className='p-2 text-gray-600'>
            {day}
          </div>
        ))}
      </div>
    );
  };

  const getTaskSpanForDay = (event: CalendarEvent, day: Date, weekStart: Date) => {
    if (!isWithinInterval(day, { start: event.startDate, end: event.endDate })) {
      return null;
    }

    const dayOfWeek = differenceInDays(day, weekStart);
    const taskStartInWeek = Math.max(0, differenceInDays(event.startDate, weekStart));
    const taskEndInWeek = Math.min(6, differenceInDays(event.endDate, weekStart));

    if (dayOfWeek !== taskStartInWeek) {
      return null;
    }

    const spanWidth = taskEndInWeek - taskStartInWeek + 1;

    return {
      width: spanWidth,
      event,
    };
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let day = startDate;

    while (day <= endDate) {
      const weekStart = day;
      const weekDays = [];
      const weekEvents = new Set<number>();

      // Render day cells
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        weekDays.push(
          <div
            key={day.toString()}
            className={`border h-24 p-1 cursor-pointer hover:bg-gray-50 relative ${
              !isSameMonth(day, monthStart) ? 'bg-gray-100 text-gray-400' : 'bg-white'
            }`}
            onClick={() => {
              setSelectedDate(cloneDay);
              setStartDate(format(cloneDay, 'yyyy-MM-dd')); // Start date is the clicked date
              setEndDate(format(addDays(cloneDay, 1), 'yyyy-MM-dd')); // End date is the next day
              setIsOpen(true);
            }}
          >
            <div className='text-sm font-medium relative z-10'>{format(day, 'd')}</div>
          </div>,
        );
        day = addDays(day, 1);
      }

      const taskSpans = [];
      let spanRow = 0;

      events.forEach((event) => {
        const span = getTaskSpanForDay(event, weekStart, weekStart);
        if (span && !weekEvents.has(event.id)) {
          weekEvents.add(event.id);
          taskSpans.push(
            <div
              key={`${event.id}-${weekStart.toISOString()}`}
              className={`absolute z-20 px-2 text-xs rounded shadow-sm truncate ${
                event.status === 'Completed'
                  ? 'bg-green-500 text-white'
                  : event.status === 'In Progress'
                    ? 'bg-blue-500 text-white'
                    : event.status === 'Canceled'
                      ? 'bg-gray-500 text-white'
                      : 'bg-yellow-500 text-white'
              }`}
              style={{
                left: `${
                  (100 / 7) *
                  differenceInDays(
                    new Date(Math.max(event.startDate.getTime(), weekStart.getTime())),
                    weekStart,
                  )
                }%`,
                width: `${(100 / 7) * span.width}%`,
                top: `${24 + spanRow * 20}px`,
                height: '18px',
                lineHeight: '18px',
              }}
              title={`${event.title} (${format(event.startDate, 'MMM d')} - ${format(
                event.endDate,
                'MMM d',
              )})`}
            >
              {event.title}
            </div>,
          );
          spanRow++;
        }
      });

      rows.push(
        <div key={weekStart.toString()} className='relative'>
          <div className='grid grid-cols-7'>{weekDays}</div>
          {taskSpans}
        </div>,
      );
    }

    return <div className='space-y-0'>{rows}</div>;
  };

  const selectedDateEvents = selectedDate
    ? events.filter(
        (e) =>
          isSameDay(e.startDate, selectedDate) ||
          isSameDay(e.endDate, selectedDate) ||
          isWithinInterval(selectedDate, { start: e.startDate, end: e.endDate }),
      )
    : [];

  return (
    <div className='max-w-6xl mx-auto mt-4 p-4'>
      {/* Error Display */}
      {error && (
        <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
          <div className='text-red-700 text-sm'>❌ {error}</div>
        </div>
      )}

      <div className='border rounded-lg shadow bg-white p-4'>
        {renderHeader()}
        {renderDays()}
        {renderCells()}

        <TaskForm
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          selectedDate={selectedDate}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          category={category}
          setCategory={setCategory}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          loading={loading}
          onAddEvent={handleAddEvent}
          selectedDateEvents={selectedDateEvents}
          onDeleteTask={handleDeleteTask}
        />
      </div>

      <TasksList
        tasks={allTasks}
        onDeleteTask={handleDeleteTask}
        onUpdateTaskStatus={handleUpdateTaskStatus}
        loading={loading}
      />
    </div>
  );
}
