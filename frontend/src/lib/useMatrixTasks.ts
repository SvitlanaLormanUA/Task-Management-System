import { useState, useEffect } from 'react';
import { useApiClient } from '@/api/useApiClient';
import type { Task } from '@/lib/types';
import type { MatrixTask, ImportanceLevel, UrgencyLevel } from '@/lib/types';
import { convertToMatrixTask } from '@/lib/matrixUtils';

export const useMatrixTasks = () => {
  const [tasks, setTasks] = useState<MatrixTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiClient = useApiClient();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('http://127.0.0.1:5000/tasks');
      
      if (response.ok) {
        const tasksData: Task[] = await response.json();
        const matrixTasks = tasksData.map(convertToMatrixTask);
        setTasks(matrixTasks);
      } else {
        throw new Error('Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      const response = await apiClient.put(`http://127.0.0.1:5000/tasks/${taskId}`, { 
        status: newStatus 
      });
      
      if (response.ok) {
        setTasks(prev => prev.map(task => 
          task.id === taskId ? { ...task, status: newStatus as Task['status'] } : task
        ));
        return true;
      } else {
        throw new Error('Failed to update task status');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      setError('Failed to update task. Please try again.');
      return false;
    }
  };

  const updateTaskPriority = async (
    taskId: number, 
    importance: ImportanceLevel, 
    urgency: UrgencyLevel
  ) => {
    try {
      // Try to save priority to database (if API supports it)
      const response = await apiClient.put(`http://127.0.0.1:5000/tasks/${taskId}`, {
        importance,
        urgency
      });
      
      if (response.ok) {
        setTasks(prev => prev.map(task => 
          task.id === taskId ? { ...task, importance, urgency } : task
        ));
        return true;
      } else {
        // If API doesn't support importance/urgency, save locally
        setTasks(prev => prev.map(task => 
          task.id === taskId ? { ...task, importance, urgency } : task
        ));
        return true;
      }
    } catch (error) {
      console.error('Error updating task priority:', error);
      // Still save locally as fallback
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, importance, urgency } : task
      ));
      return true;
    }
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const pending = total - completed;
    
    const byQuadrant = {
      doFirst: tasks.filter(t => t.importance === 'high' && t.urgency === 'high').length,
      schedule: tasks.filter(t => t.importance === 'high' && t.urgency === 'low').length,
      delegate: tasks.filter(t => t.importance === 'low' && t.urgency === 'high').length,
      eliminate: tasks.filter(t => t.importance === 'low' && t.urgency === 'low').length,
    };

    return { total, completed, pending, byQuadrant };
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    updateTaskStatus,
    updateTaskPriority,
    getTaskStats
  };
};