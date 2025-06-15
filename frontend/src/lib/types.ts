
export type TaskCategory = "Work" | "Home" | "Study" | "Other";

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
  category?: TaskCategory;
}

export interface Note {
  id: number;
  title: string;
  content?: string;
  dateCreated?: string; 
  dateUpdated?: string;
  userId: number;
}

export interface Habit {
  id: number;
  title: string;
  color: string;
  users: number[];
  status: HabitStatus;
  habitDays: HabitDays;
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
  category?: TaskCategory;
  id: number;
};
