import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Plus, X } from 'lucide-react';
import CreateHabitModal from '@/components/CreateHabitModal';
import { useApiClient } from '../api/useApiClient';
import { useAuth } from '../auth/AuthContext';
import type { Habit } from '@/lib/types';

function HabitTrackerPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [isToggling, setIsToggling] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const apiClient = useApiClient();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  // Load habits when authentication is complete
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      loadHabitsByStatus(null);
    }
  }, [authLoading, isAuthenticated]);

  const parseHabitDays = (habitDays: string | null | undefined): number[] => {
    const dayCodeMap: { [key: string]: number } = {
      MO: 0,
      TU: 1,
      WE: 2,
      TH: 3,
      FR: 4,
      SA: 5,
      SU: 6,
    };
    const dayNameMap: { [key: string]: number } = {
      Monday: 0,
      Tuesday: 1,
      Wednesday: 2,
      Thursday: 3,
      Friday: 4,
      Saturday: 5,
      Sunday: 6,
    };

    if (!habitDays) return [];

    return habitDays
      .split(',')
      .map((day) => {
        const trimmedDay = day.trim();
        return dayCodeMap[trimmedDay] !== undefined
          ? dayCodeMap[trimmedDay]
          : dayNameMap[trimmedDay];
      })
      .filter((day) => day !== undefined);
  };

  const loadHabitsByStatus = async (status: string | null) => {
    setIsLoading(true);
    try {
      let url = 'http://127.0.0.1:5000/habits';
      if (status) {
        url = `http://127.0.0.1:5000/habits?status=${encodeURIComponent(status)}`;
      }

      const response = await apiClient.get(url);
      if (response.ok) {
        const habitsData = await response.json();
        const transformedHabits = habitsData.map((habit) => {
          const completedDays =
            habit.status === 'Completed'
              ? [0, 1, 2, 3, 4, 5, 6]
              : Array.isArray(habit.completedDays)
                ? habit.completedDays
                : [];

          return {
            ...habit,
            targetDays: parseHabitDays(habit.habit_days),
            completedDays: completedDays,
          };
        });
        setHabits(transformedHabits);
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData.error);
        alert(`Failed to load habits: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Failed to load habits:', error);
      alert('Failed to load habits. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const createHabit = async (habitData) => {
    setIsCreating(true);
    try {
      const payload = { ...habitData, status: habitData.status || 'Planned' };
      const response = await apiClient.post('http://127.0.0.1:5000/habits', payload);
      if (response.ok) {
        const newHabit = await response.json();
        const transformedHabit = {
          ...newHabit,
          targetDays: parseHabitDays(newHabit.habit_days),
          completedDays: Array.isArray(newHabit.completedDays) ? newHabit.completedDays : [],
        };
        setHabits((prev) => [...prev, transformedHabit]);
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData.error);
        alert(`Failed to create habit: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Failed to create habit:', error);
      alert('Failed to create habit. Please try again.');
    } finally {
      setIsCreating(false);
      setIsModalOpen(false);
    }
  };

  const toggleHabitDay = async (habitId: number, dayIndex: number) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const originalHabits = [...habits];
    const completedDays = habit.completedDays || [];
    const isCompleted = completedDays.includes(dayIndex);
    const updatedCompletedDays = isCompleted
      ? completedDays.filter((d) => d !== dayIndex)
      : [...completedDays, dayIndex];

    const newStatus = calculateStatus(updatedCompletedDays, habit.targetDays);
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId ? { ...h, completedDays: updatedCompletedDays, status: newStatus } : h,
      ),
    );

    const allSevenDaysCompleted = [0, 1, 2, 3, 4, 5, 6].every((day) =>
      updatedCompletedDays.includes(day),
    );

    if (!allSevenDaysCompleted) return;

    setIsToggling(habitId);

    try {
      const updatedHabit = {
        title: habit.title,
        color: habit.color,
        status: 'Completed',
        habitDays: habit.habit_days,
      };

      const response = await apiClient.put(`http://127.0.0.1:5000/habits/${habitId}`, updatedHabit);
      if (response.ok) {
        const updatedHabitFromApi = await response.json();
        setHabits((prev) =>
          prev.map((h) =>
            h.id === habitId
              ? {
                  ...updatedHabitFromApi,
                  status: 'Completed',
                  targetDays: habit.targetDays,
                  completedDays: updatedCompletedDays,
                }
              : h,
          ),
        );
      } else {
        setHabits(originalHabits);
        const errorData = await response.json();
        alert(`Failed to update habit: ${errorData.error}`);
      }
    } catch (error) {
      setHabits(originalHabits);
      console.error('Failed to update habit:', error);
      alert('Failed to update habit. Please try again.');
    } finally {
      setIsToggling(null);
    }
  };

  const calculateStatus = (completedDays: number[], targetDays: number[]): string => {
    if (completedDays.length >= targetDays.length) return 'Completed';
    if (completedDays.length > 0) return 'In Progress';
    return 'Planned';
  };

  const deleteHabit = async (habitId: number) => {
    if (!window.confirm('Are you sure you want to delete this habit?')) return;

    const originalHabits = [...habits];
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    setIsDeleting(habitId);

    try {
      const response = await apiClient.delete(`http://127.0.0.1:5000/habits/${habitId}`);
      if (response.ok) {
        // No action needed; optimistic update already applied
      } else {
        setHabits(originalHabits);
        const errorData = await response.json();
        console.error('API Error:', errorData.error);
        alert(`Failed to delete habit: ${errorData.error}`);
      }
    } catch (error) {
      setHabits(originalHabits);
      console.error('Failed to delete habit:', error);
      alert('Failed to delete habit. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  const getWeekDateRange = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1 + currentWeek * 7);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return {
      start: startOfWeek.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }),
      end: endOfWeek.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }),
    };
  };

  const maxWeeksPast = -52;
  const maxWeeksFuture = 52;
  const handlePrevWeek = () => setCurrentWeek((prev) => Math.max(prev - 1, maxWeeksPast));
  const handleNextWeek = () => setCurrentWeek((prev) => Math.min(prev + 1, maxWeeksFuture));

  const weekRange = getWeekDateRange();

  if (authLoading || isLoading) {
    return (
      <div className='flex bg-yellow-50 min-h-screen items-center justify-center'>
        <div className='text-xl'>Loading habits...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className='flex bg-yellow-50 min-h-screen items-center justify-center'>
        <div className='text-xl'>Please log in to view your habits</div>
      </div>
    );
  }

  return (
    <div className='flex bg-yellow-50 min-h-screen'>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-yellow-400 text-white text-3xl flex items-center justify-center shadow-lg hover:bg-yellow-500 transition z-40 cursor-pointer ${
          isCreating ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isCreating}
      >
        <Plus size={24} />
      </button>

      {isModalOpen && (
        <CreateHabitModal onClose={() => setIsModalOpen(false)} onSubmit={createHabit} />
      )}

      <aside className='w-24 bg-yellow-100 flex flex-col justify-center items-center py-4 shadow-md'>
        <div className='space-y-4 text-xs text-gray-700 mb-8'>
          <div className='flex flex-col items-center gap-1'>
            <button
              onClick={() => {
                setStatusFilter('Completed');
                loadHabitsByStatus('Completed');
              }}
              className={`border rounded px-2 py-1 bg-green-100 cursor-pointer ${
                statusFilter === 'Completed' ? 'ring-2 ring-green-500' : ''
              }`}
            >
              Completed
            </button>
          </div>
          <div className='flex flex-col items-center gap-1'>
            <button
              onClick={() => {
                setStatusFilter('In Progress');
                loadHabitsByStatus('In Progress');
              }}
              className={`border rounded px-2 py-1 bg-blue-100 cursor-pointer ${
                statusFilter === 'In Progress' ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              In progress
            </button>
          </div>
          <div className='flex flex-col items-center gap-1'>
            <button
              onClick={() => {
                setStatusFilter('Planned');
                loadHabitsByStatus('Planned');
              }}
              className={`border rounded px-2 py-1 bg-gray-100 cursor-pointer ${
                statusFilter === 'Planned' ? 'ring-2 ring-gray-500' : ''
              }`}
            >
              Planned
            </button>
          </div>
          <div className='flex flex-col items-center gap-1 pt-2'>
            <button
              onClick={() => {
                setStatusFilter(null);
                loadHabitsByStatus(null);
              }}
              className={`border rounded px-2 py-1 cursor-pointer ${
                !statusFilter ? 'ring-2 ring-yellow-500 bg-yellow-200' : 'bg-white'
              }`}
            >
              All habits
            </button>
          </div>
        </div>
        <div className='w-20 h-20 rounded-full bg-yellow-200 flex items-center justify-center mb-4'>
          <span className='text-2xl'>🐰</span>
        </div>
        <button
          className='flex items-center gap-2 text-gray-700 hover:text-black hover:cursor-pointer text-sm'
          onClick={() => window.history.back()}
        >
          <span>←</span>
          Back
        </button>
      </aside>

      <div className='flex-1 flex flex-col'>
        <div className='bg-yellow-100 py-4 px-8'>
          <h1 className='text-2xl font-bold text-gray-800'>Habit Tracker</h1>
        </div>

        <div className='flex justify-between items-center px-8 py-4'>
          <button
            onClick={handlePrevWeek}
            disabled={currentWeek <= maxWeeksPast}
            className={`p-2 hover:bg-gray-100 rounded-full ${
              currentWeek <= maxWeeksPast ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className='text-xl font-semibold'>
            {weekRange.start} - {weekRange.end}
          </h2>
          <button
            onClick={handleNextWeek}
            disabled={currentWeek >= maxWeeksFuture}
            className={`p-2 hover:bg-gray-100 rounded-full ${
              currentWeek >= maxWeeksFuture ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className='flex-1 px-4 pb-4 space-y-4'>
          {habits.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-gray-500 text-lg mb-4'>
                {statusFilter ? `No ${statusFilter.toLowerCase()} habits` : 'No habits yet'}
              </p>
              <p className='text-gray-400'>Click the + button to create a new habit</p>
            </div>
          ) : (
            habits.map((habit) => (
              <div
                key={habit.id}
                className='rounded-3xl p-6 shadow-sm'
                style={{ backgroundColor: habit.color + '20' }}
              >
                <div className='flex justify-between items-start mb-4'>
                  <h3 className='text-xl font-semibold'>{habit.title}</h3>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    disabled={isDeleting === habit.id}
                    className={`text-red-500 hover:text-red-700 p-1 ${
                      isDeleting === habit.id ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className='flex gap-2 mb-4'>
                  {days.map((day, index) => {
                    const isTargetDay = habit.targetDays.includes(index);
                    const isCompleted = habit.completedDays?.includes(index);
                    return (
                      <button
                        key={index}
                        onClick={() => toggleHabitDay(habit.id, index)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors cursor-pointer${
                          isTargetDay
                            ? isCompleted
                              ? 'bg-blue-200 text-blue-800'
                              : 'bg-white text-gray-700 hover:bg-blue-50'
                            : 'bg-gray-100 text-gray-400 cursor-default'
                        } ${isToggling === habit.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isCompleted ? <Check size={16} /> : day}
                      </button>
                    );
                  })}
                </div>
                <div className='text-sm text-gray-500 ml-auto flex'>
                  <span className='text-sm text-gray-500 ml-auto flex gap-2'>
                    <span className='text-sm text-gray-600'>
                      {habit.completedDays.length} times a week
                    </span>
                    {habit.completedDays?.length >= habit.targetDays.length && (
                      <Check className='text-green-600 w-4 h-4 mt-[3px]' />
                    )}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default HabitTrackerPage;
