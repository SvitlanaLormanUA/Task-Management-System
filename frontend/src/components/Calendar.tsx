import { useState, useEffect, useMemo } from 'react';
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
import type { Task, TaskStatus, CalendarEvent } from '../lib/types';
import TaskForm from './TaskForm';
import TasksList from './TaskList';
import { baseCategories } from '@/lib/common';

type CalendarProps = {
  selectedStatuses: string[];
  selectedCategories: string[];
  onCategoriesUpdate?: (categories: string[]) => void;
};

function isWithinInterval(date: Date, interval: { start: Date; end: Date }): boolean {
  return date >= interval.start && date <= interval.end;
}

const fetchTasks = async (apiClient: ReturnType<typeof useApiClient>): Promise<Task[]> => {
  const response = await apiClient.get('http://127.0.0.1:5000/tasks');
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error || 'Failed to fetch tasks');
  }
  return response.json();
};

const createTask = async (
  apiClient: ReturnType<typeof useApiClient>,
  taskData: {
    title: string;
    description?: string;
    dateAssigned?: string;
    dateDue?: string;
    status?: TaskStatus;
    category?: string;
  },
): Promise<Task> => {
    const response = await apiClient.post('http://127.0.0.1:5000/tasks', taskData);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || 'Failed to create task');
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
  taskData: Partial<Task>,
): Promise<Task> => {
    const response = await apiClient.put(`http://127.0.0.1:5000/tasks/${taskId}`, taskData);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || 'Failed to update task');
    }
    return response.json();
};

export default function Calendar({ selectedStatuses, selectedCategories, onCategoriesUpdate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('Other');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(baseCategories);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const apiClient = useApiClient();

  useEffect(() => {
    const loadAllTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        const tasksFromServer = await fetchTasks(apiClient);
        setAllTasks(tasksFromServer);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    loadAllTasks();
  }, [apiClient]);

  const filteredTasks = useMemo(() => {
    if (selectedStatuses.length === 0 || selectedCategories.length === 0) {
      return [];
    }
    return allTasks.filter(task => {
      const statusMatch = selectedStatuses.includes(task.status);
      const categoryMatch = selectedCategories.includes(task.category || 'Other');
      return statusMatch && categoryMatch;
    });
  }, [allTasks, selectedStatuses, selectedCategories]);

  useEffect(() => {
    const newEvents: CalendarEvent[] = filteredTasks
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
  }, [filteredTasks]);


useEffect(() => {
  const taskCategories = allTasks
    .map((task) => task.category)
    .filter((cat): cat is string => Boolean(cat));
  const allDynamicCategories = Array.from(new Set([...baseCategories, ...taskCategories]));
  setCategories(allDynamicCategories);
  onCategoriesUpdate?.(allDynamicCategories); 
}, [allTasks, onCategoriesUpdate]);

  const handleAddCategory = (newCategory: string) => {
    const trimmedCategory = newCategory.trim();
    if (trimmedCategory && !categories.includes(trimmedCategory)) {
      setCategories((prev) => [...prev, trimmedCategory]);
    }
  };

  const handleDeleteCategory = async (categoryToDelete: string) => {
    if (!baseCategories.includes(categoryToDelete)) {
      try {
        setLoading(true);
        setCategories((prev) => prev.filter((cat) => cat !== categoryToDelete));
        setAllTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.category === categoryToDelete ? { ...task, category: 'Other' } : task,
          ),
        );
        if (category === categoryToDelete) {
          setCategory('Other');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete category');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddEvent = async () => {
    if (!selectedDate || !title.trim() || !startDate || !endDate) return;
    try {
      setLoading(true);
      setError(null);
      const taskData = {
        title: title.trim(),
        description: description.trim() || undefined,
        dateAssigned: new Date(startDate).toISOString(),
        dateDue: new Date(endDate).toISOString(),
        status: 'Pending' as TaskStatus,
        category: category,
      };

      if (editingTaskId) {
        const updatedTask = await updateTask(apiClient, editingTaskId, taskData);
        setAllTasks((prev) => prev.map((task) => (task.id === editingTaskId ? updatedTask : task)));
      } else {
        const newTask = await createTask(apiClient, taskData);
        setAllTasks((prev) => [...prev, newTask]);
      }

      setIsOpen(false);
      setEditingTaskId(null);
      setTitle('');
      setDescription('');
      setCategory('Other');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process task');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = (taskId: number) => {
    const task = allTasks.find((t) => t.id === taskId);
    if (task) {
      setEditingTaskId(taskId);
      setTitle(task.title);
      setDescription(task.description || '');
      setCategory(task.category || 'Other');
      setStartDate(task.dateAssigned ? format(new Date(task.dateAssigned), 'yyyy-MM-dd') : '');
      setEndDate(task.dateDue ? format(new Date(task.dateDue), 'yyyy-MM-dd') : '');
      setSelectedDate(task.dateAssigned ? new Date(task.dateAssigned) : null);
      setIsOpen(true);
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
    } finally {
      setLoading(false);
    }
  };
  

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4 dark:text-black">
      <button
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        className="p-2 hover:bg-gray-100 rounded"
        disabled={loading}
      >
        ◄
      </button>
      <h2 className="text-xl dark:text-black font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
      <button
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        className="p-2 hover:bg-gray-100 rounded"
        disabled={loading}
      >
        ►
      </button>
    </div>
  );

  const renderDays = () => {
    const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    return (
      <div className="grid grid-cols-7 text-center font-medium mb-2 dark:text-black">
        {days.map((day) => (
          <div key={day} className="p-2 text-gray-600 dark:text-black">
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
    const today = new Date();

    const rows = [];
    let day = startDate;

    while (day <= endDate) {
      const weekStart = day;
      const weekDays = [];

      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isToday = isSameDay(day, today);
        weekDays.push(
          <div
            key={day.toString()}
            className={`border h-24 p-1 cursor-pointer hover:bg-gray-50 relative ${
              !isSameMonth(day, monthStart) ? 'bg-gray-100 text-gray-400 dark:text-black' : 'bg-white'
            }`}
            onClick={() => {
              setSelectedDate(cloneDay);
              setStartDate(format(cloneDay, 'yyyy-MM-dd'));
              setEndDate(format(addDays(cloneDay, 1), 'yyyy-MM-dd'));
              setEditingTaskId(null);
              setTitle('');
              setDescription('');
              setCategory('Other');
              setIsOpen(true);
            }}
          >
            <div
              className={`text-sm font-medium relative z-10 dark:text-black flex items-center justify-center w-6 h-6 ${
                isToday ? 'p-4 rounded-full text-white bg-[#614D7C]' : ''
              }`}
            >
              {format(day, 'd')}
            </div>
          </div>,
        );
        day = addDays(day, 1);
      }

      const taskSpans = [];
      let spanRow = 0;

      events.forEach((event) => {
        const span = getTaskSpanForDay(event, weekStart, weekStart);
        if (span) {
          taskSpans.push(
            <div
              key={`${event.id}-${weekStart.toISOString()}-${spanRow}`}
              className={`absolute z-20 px-2 text-xs dark:text-black rounded shadow-sm truncate mt-5 cursor-pointer ${
                event.status === 'Completed'
                  ? 'bg-green-500 text-white'
                  : event.status === 'In Progress'
                    ? 'bg-blue-500 text-white'
                    : event.status === 'Canceled'
                      ? 'bg-gray-500 text-white'
                      : 'bg-yellow-500 text-white'
              }`}
              style={{
                left: `${(100 / 7) * differenceInDays(new Date(Math.max(event.startDate.getTime(), weekStart.getTime())), weekStart)}%`,
                width: `${(100 / 7) * span.width}%`,
                top: `${24 + spanRow * 20}px`,
                height: '18px',
                lineHeight: '18px',
              }}
              title={`${event.title} (${format(event.startDate, 'MMM d')} - ${format(event.endDate, 'MMM d')})`}
              onClick={(e) => { e.stopPropagation(); handleEditTask(event.id); }}
            >
              {event.title}
            </div>,
          );
          spanRow++;
        }
      });
      rows.push(
        <div key={weekStart.toString()} className="relative">
          <div className="grid grid-cols-7">{weekDays}</div>
          {taskSpans}
        </div>,
      );
    }
    return <div className="space-y-0">{rows}</div>;
  };
  
  // if (loading) {
  //   return <div className="flex justify-center items-center h-screen">Loading tasks...</div>;
  // }

  return (
    <div className="max-w-6xl mx-auto mt-4 p-4">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-700 text-sm">{error}</div>
        </div>
      )}

      <div className="border rounded-lg shadow bg-white p-4">
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
          categories={categories}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          editingTaskId={editingTaskId}
          setEditingTaskId={setEditingTaskId}
          selectedDateEvents={
            selectedDate
              ? events.filter(
                  (event) =>
                    event.startDate <= selectedDate &&
                    event.endDate >= selectedDate
                )
              : []
          }
        />
      </div>

      <TasksList
        tasks={filteredTasks}
        onDeleteTask={handleDeleteTask}
        onUpdateTaskStatus={handleUpdateTaskStatus}
        onEditTask={handleEditTask}
        loading={loading}
      />
    </div>
  );
}