// types.ts
export enum TaskCategory {
  WORK = "Work",
  HOME = "Home",
  STUDY = "Study",
  OTHER = "Other",
}

export enum TaskStatus {
  PENDING = "Pending",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  CANCELED = "Canceled",
}

export enum HabitDays {
  SU = "Sunday",
  MO = "Monday",
  TU = "Tuesday",
  WE = "Wednesday",
  TH = "Thursday",
  FR = "Friday",
  SA = "Saturday",
}

export enum HabitStatus {
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  CANCELED = "Canceled",
  PLANNED = "Planned",
}

export enum GoalPeriod {
  MONTHLY = "Monthly",
  WEEKLY = "Weekly",
  YEARLY = "Yearly",
  FIVE_YEAR = "Five Year",
}

export enum GoalStatus {
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  CANCELED = "Canceled",
  PLANNED = "Planned",
}

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
  dateCreated?: string; // ISO string
  dateUpdated?: string; // ISO string
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