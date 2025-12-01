import { z } from 'zod';
import { createTaskSchema, updateTaskSchema } from '../validations/task';

export type CreateTaskFormInput = z.input<typeof createTaskSchema>;
export type CreateTaskFormOutput = z.output<typeof createTaskSchema>;
export type UpdateTaskFormInput = z.input<typeof updateTaskSchema>;
export type UpdateTaskFormOutput = z.output<typeof updateTaskSchema>;

export interface Task {
  task_id: string;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: 'Baixa' | 'Média' | 'Alta';
  status: 'Pendente' | 'Em andamento' | 'Concluída' | 'Cancelada';
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  due_date?: string;
}

export interface UpdateTaskDto {
  title: string;
  description?: string;
  due_date?: string;
  priority: 'Baixa' | 'Média' | 'Alta';
  status: 'Pendente' | 'Em andamento' | 'Concluída' | 'Cancelada';
}
