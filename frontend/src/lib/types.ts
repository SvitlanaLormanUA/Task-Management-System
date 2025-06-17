
export type TaskStatus = "Pending" | "In Progress" | "Completed" | "Canceled";

export type HabitDays =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export type HabitStatus = "In Progress" | "Completed" | "Canceled" | "Planned";

export type GoalPeriod = "Monthly" | "Weekly" | "Yearly" | "Five Year";

export type GoalStatus = "In Progress" | "Completed" | "Canceled" | "Planned";

export interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  location?: string;
  tasks: number[];
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  dateAssigned?: string; // ISO string, e.g., "2025-06-01T12:00:00Z"
  dateDue?: string; // ISO string
  users: number[];
  status: TaskStatus;
  category?: string;
}

export interface Note {
  id: number;
  title: string;
  content?: string;
  dateCreated?: string; 
  dateUpdated?: string;
  userId: number;
}
export interface Goal {
  id: number;
  title: string;
  description?: string;
  users: number[];
  status: GoalStatus;
  goalPeriod: GoalPeriod;
}
export type CalendarEvent = {
  startDate: Date;
  endDate: Date;
  title: string;
  status: TaskStatus;
  category?: string;
  id: number;
};

export type Habit = {
  id: number;
  title: string;
  color: string;
  status: string;
  habit_days: string;
  targetDays: number[];
  completedDays: number[];
};
export interface CreateTaskData {
  title: string;
  description?: string;
  category?: string;
  dateDue?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

export type ImportanceLevel = 'high' | 'low';
export type UrgencyLevel = 'high' | 'low';

export interface MatrixTask extends Task {
  importance: ImportanceLevel;
  urgency: UrgencyLevel;
}

export type QuadrantType = 'do-first' | 'schedule' | 'delegate' | 'eliminate';

export interface Quadrant {
  id: QuadrantType;
  title: string;
  description: string;
  color: string;
  importance: ImportanceLevel;
  urgency: UrgencyLevel;
}

export const QUADRANTS: Quadrant[] = [
  {
    id: 'do-first',
    title: 'DO FIRST',
    description: 'Important & Urgent',
    color: 'bg-red-200/80',
    importance: 'high',
    urgency: 'high'
  },
  {
    id: 'schedule',
    title: 'SCHEDULE',
    description: 'Important & Not Urgent',
    color: 'bg-green-200/80',
    importance: 'high',
    urgency: 'low'
  },
  {
    id: 'delegate',
    title: 'DELEGATE',
    description: 'Not Important & Urgent',
    color: 'bg-yellow-200/80',
    importance: 'low',
    urgency: 'high'
  },
  {
    id: 'eliminate',
    title: 'ELIMINATE',
    description: 'Not Important & Not Urgent',
    color: 'bg-gray-200/80',
    importance: 'low',
    urgency: 'low'
  }
];