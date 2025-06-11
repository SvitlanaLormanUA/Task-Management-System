import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Header from '@/components/Header.tsx';
import Square from '@/components/Square';
import Calendar from '@/components/Calendar.tsx';
import { createTask, getUserByEmail, fetchTasks } from '@/lib/api';
import type { Task, TaskStatus, TaskCategory, User } from '../lib/types';

const CalendarPage = () => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskData, setTaskData] = useState<{
    title: string;
    description: string;
    dateAssigned: Date;
    dateDue?: Date;
    status: TaskStatus;
    category: TaskCategory;
    userId: number;
  }>({
    title: '',
    description: '',
    dateAssigned: new Date(),
    dateDue: undefined,
    status: 'Pending',
    category: 'Work',
    userId: 0,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUserAndTasks = async () => {
      setIsLoadingUser(true);
      const userCookie = Cookies.get('user');
      console.log('User cookie:', userCookie);
      if (userCookie) {
        try {
          let email: string | undefined;

          if (userCookie.startsWith('{')) {
            const parsedUser: User = JSON.parse(userCookie);
            console.log('Parsed user:', parsedUser);
            email = parsedUser.email;
          } else {
            email = userCookie.replace(/"/g, '');
            console.log('Using cookie as email:', email);
          }

          if (email) {
            console.log('Fetching user with email:', email);
            const userData = await getUserByEmail(email);
            console.log('Fetched user data:', userData);
            setUser(userData);
            const tasksData = await fetchTasks(userData.id);
            console.log('Fetched tasks:', tasksData);
            setTasks(tasksData);
          } else {
            setError('No email found in user data');
            console.log('Error: No email in parsed user');
          }
        } catch (err) {
          console.error('Error fetching user or tasks:', err);
          if (err.response?.status === 404) {
            setError('User not found');
          } else if (err.response?.status === 401) {
            setError('Authentication required');
          } else {
            setError('Failed to fetch user or tasks');
          }
        }
      } else {
        setError('User not authenticated');
        console.log('Error: No user cookie found');
      }
      setIsLoadingUser(false);
    };

    fetchUserAndTasks();
  }, []);

  if (isLoadingUser) {
    return <div>Loading...</div>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskData.title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const accessToken = Cookies.get('access_token');
      if (!accessToken) {
        throw new Error('No access token found. Please log in.');
      }

      const taskPayload = {
        title: taskData.title.trim(),
        description: taskData.description.trim() || undefined,
        dateAssigned: taskData.dateAssigned instanceof Date ? taskData.dateAssigned.toISOString() : new Date().toISOString(),
        dateDue: taskData.dateDue ? taskData.dateDue.toISOString() : undefined,
        status: taskData.status,
        category: taskData.category,
        access_token: accessToken,
      };


      const data = await createTask(taskPayload);

      setTaskData({
        title: '',
        description: '',
        dateAssigned: new Date(),
        dateDue: undefined,
        status: 'Pending',
        category: 'Work',
        userId: user?.id || 0,
      });

      if (data) {
        console.log('Task created successfully:', data);
        const tasksData = await fetchTasks(user?.id || 0);
        setTasks(tasksData);
      }
      setShowTaskForm(false);
    } catch (err) {
      console.error('Full error details:', err);
      setError(err.response?.data?.error || err.message || 'Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex bg-blue-100 min-h-screen">
      <Header className="absolute top-4 left-4 z-10 md:top-6 md:left-6" />

      {/* Sidebar */}
      <aside className="w-24 bg-yellow-100 flex flex-col justify-center items-center py-4 shadow-md">
        <div className="space-y-4 text-xs text-gray-700">
          <div className="flex flex-col items-center gap-1">
            <span className="border rounded px-2 py-1">Home</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="border rounded px-2 py-1">Lectures</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="border rounded px-2 py-1">Seminars</span>
          </div>
        </div>
        <div className="w-36 h-36 rounded-full overflow-hidden mb-4">
          <img src="./images/bunny.webp" alt="Character" className="w-full h-full object-cover" />
        </div>

        <button
          onClick={() => window.location.href = '/'}
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
              className="w-36 h-24 p-4"
              onClick={() => window.location.href = tab.path}

            />
          ))}
        </div>

        <div className="min-h-screen bg-blue-100 p-4">
          {/* Add Task Button */}
          <div className="mb-4">
            <button
              onClick={() => setShowTaskForm(true)}
              className="bg-[#5c3d82] text-white py-2 px-4 rounded-full hover:bg-[#472f68] transition"
            >
              Add New Task
            </button>
          </div>

          {/* Task Creation Form (Modal-like) */}
          {showTaskForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
              <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold text-[#4b306a] mb-4">Create New Task</h2>
                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={taskData.title}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                      placeholder="Task title"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description (Optional)
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={taskData.description}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                      placeholder="Task description"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label htmlFor="dateAssigned" className="block text-sm font-medium text-gray-700">
                      Due Date (Optional)
                    </label>
                    <input
                      type="date"
                      id="dateAssigned"
                      name="dateAssigned"
                      value={taskData.dateAssigned}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={taskData.status}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                      disabled={loading}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Canceled">Canceled</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={taskData.category}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                      disabled={loading}
                    >
                      <option value="Work">Work</option>
                      <option value="Home">Home</option>
                      <option value="Study">Study</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#5c3d82] text-white py-2 px-4 rounded-full hover:bg-[#472f68] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Creating...' : 'Create Task'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowTaskForm(false);
                        setError('');
                        setTaskData({
                          title: '',
                          description: '',
                          dateAssigned: '',
                          status: 'Pending',
                          category: 'Work',
                          userId: user?.id || 0,
                        });
                      }}
                      className="text-[#5c3d82] py-2 px-4 rounded-full border border-[#5c3d82] hover:bg-[#5c3d82] hover:text-white transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <Calendar tasks={tasks} />
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;