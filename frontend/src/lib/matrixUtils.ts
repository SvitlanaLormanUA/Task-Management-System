import type { Task } from '@/lib/types';
import type { MatrixTask, ImportanceLevel, UrgencyLevel } from './types';

export const categorizeImportance = (task: Task): ImportanceLevel => {
  const importantKeywords = ['important', 'critical', 'priority', 'urgent', 'deadline'];
  const taskText = `${task.title} ${task.description || ''}`.toLowerCase();
  
  if (importantKeywords.some(keyword => taskText.includes(keyword))) {
    return 'high';
  }
  
  // Якщо категорія вказує на важливість
  if (task.category && ['work', 'project', 'health', 'family'].includes(task.category.toLowerCase())) {
    return 'high';
  }
  
  return 'low';
};

export const categorizeUrgency = (task: Task): UrgencyLevel => {
  if (!task.dateDue) return 'low';
  
  const dueDate = new Date(task.dateDue);
  const today = new Date();
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays <= 3 ? 'high' : 'low';
};

export const convertToMatrixTask = (task: Task): MatrixTask => {
  if ('importance' in task && 'urgency' in task) {
    return task as MatrixTask;
  }
  
  return {
    ...task,
    importance: categorizeImportance(task),
    urgency: categorizeUrgency(task)
  };
};

export const getTasksByQuadrant = (
  tasks: MatrixTask[], 
  importance: ImportanceLevel, 
  urgency: UrgencyLevel
): MatrixTask[] => {
  return tasks.filter(task => task.importance === importance && task.urgency === urgency);
};

export const formatDate = (dateString?: string): string | null => {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

export const isTaskOverdue = (task: Task): boolean => {
  if (!task.dateDue) return false;
  const isCompleted = task.status === 'Completed';
  return new Date(task.dateDue) < new Date() && !isCompleted;
};