/**
 * @summary
 * Type definitions for Task entity.
 *
 * @module services/task/taskTypes
 */

/**
 * @interface TaskEntity
 * @description Represents a task entity in the system
 *
 * @property {string} task_id - Unique task identifier (UUID)
 * @property {string} user_id - Owner identifier (UUID)
 * @property {string} title - Task title
 * @property {string | null} description - Task description
 * @property {string | null} due_date - Due date (ISO 8601)
 * @property {string} priority - Priority level (Baixa | Média | Alta)
 * @property {string} status - Current status (Pendente | Em andamento | Concluída | Cancelada)
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 * @property {string | null} completed_at - Completion timestamp
 */
export interface TaskEntity {
  task_id: string;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

/**
 * @interface TaskCreateRequest
 * @description Request payload for creating a task
 */
export interface TaskCreateRequest {
  title: string;
  description?: string | null;
  due_date?: string | null;
}

/**
 * @interface TaskUpdateRequest
 * @description Request payload for updating a task
 */
export interface TaskUpdateRequest {
  title: string;
  description: string | null;
  due_date: string | null;
  priority: string;
  status: string;
}
