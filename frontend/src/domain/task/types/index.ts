import { z } from 'zod';
import { createTaskSchema } from '../validations/task';

export type CreateTaskFormInput = z.input<typeof createTaskSchema>;
export type CreateTaskFormOutput = z.output<typeof createTaskSchema>;

export interface Task {
  task_id: string;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  due_date?: string;
}
