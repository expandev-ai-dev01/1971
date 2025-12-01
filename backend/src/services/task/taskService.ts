/**
 * @summary
 * Business logic for Task entity.
 * Handles creation of tasks with validation and default values.
 *
 * @module services/task/taskService
 */

import { randomUUID } from 'crypto';
import { taskStore } from '@/instances';
import { ServiceError } from '@/utils';
import { TASK_DEFAULTS } from '@/constants/task';
import { TaskEntity } from './taskTypes';
import { createTaskSchema } from './taskValidation';

/**
 * @summary
 * Creates a new task entity with validated data.
 *
 * @function taskCreate
 * @module services/task
 *
 * @param {string} userId - The ID of the authenticated user creating the task
 * @param {unknown} body - Raw request body to validate
 * @returns {Promise<TaskEntity>} The newly created task entity
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When body fails schema validation
 */
export async function taskCreate(userId: string, body: unknown): Promise<TaskEntity> {
  const validation = createTaskSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const params = validation.data;
  const now = new Date().toISOString();
  const taskId = randomUUID();

  const newTask: TaskEntity = {
    task_id: taskId,
    user_id: userId,
    title: params.title,
    description: params.description ?? null,
    due_date: params.due_date ?? null,
    status: TASK_DEFAULTS.INITIAL_STATUS,
    created_at: now,
    updated_at: now,
  };

  taskStore.add(newTask);
  return newTask;
}
