import type { User, Task, Note, Habit, Goal, TaskStatus, TaskCategory, GoalStatus, GoalPeriod, HabitStatus, HabitDays } from './types';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:5000';

const apiStore = {
  get: async <T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> => {
    const url = new URL(`${API_URL}${endpoint}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key].toString()));

    const token = Cookies.get('access_token');

    const headers: HeadersInit = {
  'Content-Type': 'application/json',
  'Authorization': token ? `Bearer ${token}` : '',
};
    const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || JSON.stringify(errorData) || 'Network response was not ok');
    }
    return response.json() as Promise<T>;
  },
 post: async <T>(endpoint: string, data: unknown): Promise<T> => {

const token = Cookies.get('access_token');

  const accessToken = (typeof data === 'object' && data !== null && 'access_token' in data)
    ? (data as { access_token?: string }).access_token
    : undefined;
  
const headers: HeadersInit = {
  'Content-Type': 'application/json',
  'Authorization': accessToken || token ? `Bearer ${accessToken || token}` : '',
};

console.log('Headers:', headers);

const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
  method: 'POST',
  headers,
  body: JSON.stringify(data),
});

  if (!response.ok) {
    const errorData: Error = await response.json();
    throw new Error(errorData?.message || JSON.stringify(errorData) || 'Network response was not ok');
  }
  return response.json() as Promise<T>;
},
  put: async <T>(endpoint: string, data: unknown): Promise<T> => {
    
    const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData: Error = await response.json();
      throw new Error(errorData?.message || JSON.stringify(errorData) || 'Network response was not ok');
    }
    return response.json() as Promise<T>;
  },
  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      const errorData: Error = await response.json();
     throw new Error(errorData?.message || JSON.stringify(errorData) || 'Network response was not ok');
    }
    return response.json() as Promise<T>;
  },

  options: async<T>(endpoint: string): Promise<T> => {
    const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
      method: 'OPTIONS',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      const errorData: Error = await response.json();
     throw new Error(errorData?.message || JSON.stringify(errorData) || 'Network response was not ok');
    }
    return response.json() as Promise<T>;
  },
};

// User endpoints

// Припустимо, що apiStore - це якийсь HTTP клієнт (axios або власний)

export const fetchDefaultHomepage = (): Promise<string> => {
  return fetch('http://127.0.0.1:5000/')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();  // або response.json(), якщо потрібен JSON
    });
};


//export const fetchDefaultHomepage = () => apiStore.get<string>('/');
export const fetchUsers = () => apiStore.get<User[]>('/users');
export const createUser = (data: { name: string; email: string; password: string; phoneNumber?: string; location?: string }) =>
  apiStore.post<User>('/users', data);
export const updateUser = (userId: number, data: Partial<User>) => apiStore.put<User>(`/users/${userId}`, data);
export const deleteUser = (userId: number) => apiStore.delete<{ message: string }>(`/users/${userId}`);
export const loginUser = (data: { email: string; password: string }) =>
  apiStore.post<{ access_token: string; refresh_token: string; user: User }>('/login', data);
export const signupUser = (data: { name: string; email: string; password: string; phoneNumber?: string; location?: string }) =>
  apiStore.post<{ access_token: string; refresh_token: string; user: User }>('/signup', data);
export const getUserByEmail = (email: string) => apiStore.get<User>(`/users/${email}`, { email });

// Task endpoints
export const fetchTasks = () => apiStore.get<Task[]>('/tasks');
export const fetchTaskById = (taskId: number) => apiStore.get<Task>(`/tasks/${taskId}`);
export const fetchTasksByStatus = (status: TaskStatus) => apiStore.get<Task[]>('/tasks/status', { status });
export const fetchTasksByCategory = (category: TaskCategory) => apiStore.get<Task[]>('/tasks/category', { category });
export const fetchTasksByDateAssigned = (dateAssigned: string) => apiStore.get<Task[]>('/tasks/dateAssigned', { dateAssigned });
export const fetchTasksByDateDue = (dateDue: string) => apiStore.get<Task[]>('/tasks/dateDue', { dateDue });
export const createTask = (data: { title: string; description?: string; dateAssigned?: string; dateDue?: string; status?: TaskStatus; category?: TaskCategory, access_token?: string }) =>
  apiStore.post<Task>('/tasks', data);
export const updateTask = (taskId: number, data: Partial<Task>) => apiStore.put<Task>(`/tasks/${taskId}`, data);
export const deleteTask = (taskId: number) => apiStore.delete<{ message: string }>(`/tasks/${taskId}`);
export const assignUserToTask = (taskId: number, userId: number) => apiStore.get<Task>(`/tasks/${taskId}/users`, { user_id: userId });

// Note endpoints
export const fetchNotes = (userId: number) => apiStore.get<Note[]>('/notes', { user_id: userId });
export const fetchNoteById = (noteId: number) => apiStore.get<Note>(`/notes/${noteId}`);
export const createNote = (data: { user_id: number; title: string; content?: string; dateCreated?: string; dateUpdated?: string }) =>
  apiStore.post<Note>('/notes', data);
export const updateNote = (noteId: number, data: Partial<Note>) => apiStore.put<Note>(`/notes/${noteId}`, data);
export const deleteNote = (noteId: number) => apiStore.delete<{ message: string }>(`/notes/${noteId}`);

// Goal endpoints
export const fetchGoals = (userId: number) => apiStore.get<Goal[]>('/goals', { user_id: userId });
export const fetchGoalById = (goalId: number) => apiStore.get<Goal>(`/goals/${goalId}`);
export const fetchGoalsByStatus = (status: GoalStatus) => apiStore.get<Goal[]>('/goals/status', { status });
export const fetchGoalsByPeriod = (period: GoalPeriod) => apiStore.get<Goal[]>('/goals/period', { period });
export const createGoal = (data: { user_id: number; title: string; description?: string; status?: GoalStatus; period?: GoalPeriod }) =>
  apiStore.post<Goal>('/goals', data);
export const updateGoal = (goalId: number, data: Partial<Goal>) => apiStore.put<Goal>(`/goals/${goalId}`, data);
export const deleteGoal = (goalId: number) => apiStore.delete<{ message: string }>(`/goals/${goalId}`);

// Habit endpoints
export const fetchHabits = (userId: number) => apiStore.get<Habit[]>('/habits', { user_id: userId });
export const fetchHabitById = (habitId: number) => apiStore.get<Habit>(`/habits/${habitId}`);
export const fetchHabitsByStatus = (status: HabitStatus) => apiStore.get<Habit[]>('/habits/status', { status });
export const fetchHabitsByDays = (habitDays: HabitDays) => apiStore.get<Habit[]>('/habits/days', { habitDays });
export const createHabit = (data: { user_id: number; title: string; color: string; status?: HabitStatus; habitDays?: HabitDays }) =>
  apiStore.post<Habit>('/habits', data);
export const updateHabit = (habitId: number, data: Partial<Habit>) => apiStore.put<Habit>(`/habits/${habitId}`, data);
export const deleteHabit = (habitId: number) => apiStore.delete<{ message: string }>(`/habits/${habitId}`);

export default apiStore;