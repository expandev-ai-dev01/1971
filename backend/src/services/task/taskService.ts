/**
 * @summary
 * Business logic for Task entity.
 * Handles CRUD operations with validation and default values.
 *
 * @module services/task/taskService
 */

import { randomUUID } from 'crypto';
import { taskStore } from '@/instances';
import { ServiceError } from '@/utils';
import { TASK_DEFAULTS, TASK_STATUS } from '@/constants/task';
import { TaskEntity } from './taskTypes';
import { createTaskSchema, updateTaskSchema, paramsSchema } from './taskValidation';

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
    priority: TASK_DEFAULTS.INITIAL_PRIORITY,
    status: TASK_DEFAULTS.INITIAL_STATUS,
    created_at: now,
    updated_at: now,
    completed_at: null,
  };

  taskStore.add(newTask);
  return newTask;
}

/**
 * @summary
 * Retrieves a specific task by its unique identifier.
 * Validates that the task belongs to the requesting user.
 *
 * @function taskGet
 * @module services/task
 *
 * @param {string} userId - The ID of the authenticated user
 * @param {unknown} params - Raw request params containing the task ID
 * @returns {Promise<TaskEntity>} The found task entity
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When ID parameter is invalid
 * @throws {ServiceError} NOT_FOUND (404) - When task does not exist
 * @throws {ServiceError} UNAUTHORIZED (403) - When user doesn't own the task
 */
export async function taskGet(userId: string, params: unknown): Promise<TaskEntity> {
  const validation = paramsSchema.safeParse(params);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid task ID', 400, validation.error.errors);
  }

  const { id } = validation.data;
  const task = taskStore.getById(id);

  if (!task) {
    throw new ServiceError('NOT_FOUND', 'Task not found', 404);
  }

  if (task.user_id !== userId) {
    throw new ServiceError('UNAUTHORIZED', 'You do not have permission to access this task', 403);
  }

  return task;
}

/**
 * @summary
 * Updates an existing task entity with new data.
 * Automatically manages completion timestamp based on status changes.
 *
 * @function taskUpdate
 * @module services/task
 *
 * @param {string} userId - The ID of the authenticated user
 * @param {unknown} params - Raw request params containing the task ID
 * @param {unknown} body - Raw request body with update data
 * @returns {Promise<TaskEntity>} The updated task entity
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When ID or body fails validation
 * @throws {ServiceError} NOT_FOUND (404) - When task does not exist
 * @throws {ServiceError} UNAUTHORIZED (403) - When user doesn't own the task
 */
export async function taskUpdate(
  userId: string,
  params: unknown,
  body: unknown
): Promise<TaskEntity> {
  const paramsValidation = paramsSchema.safeParse(params);

  if (!paramsValidation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Invalid task ID',
      400,
      paramsValidation.error.errors
    );
  }

  const bodyValidation = updateTaskSchema.safeParse(body);

  if (!bodyValidation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Validation failed',
      400,
      bodyValidation.error.errors
    );
  }

  const { id } = paramsValidation.data;
  const existing = taskStore.getById(id);

  if (!existing) {
    throw new ServiceError('NOT_FOUND', 'Task not found', 404);
  }

  if (existing.user_id !== userId) {
    throw new ServiceError('UNAUTHORIZED', 'You do not have permission to update this task', 403);
  }

  const updateData = bodyValidation.data;
  const now = new Date().toISOString();

  /**
   * @rule {BR-006} If status changed to 'Concluída', set completion timestamp
   * @rule {BR-007} If status changed from 'Concluída' to another, clear completion timestamp
   */
  let completedAt = existing.completed_at;
  if (updateData.status === TASK_STATUS.COMPLETED && existing.status !== TASK_STATUS.COMPLETED) {
    completedAt = now;
  } else if (
    updateData.status !== TASK_STATUS.COMPLETED &&
    existing.status === TASK_STATUS.COMPLETED
  ) {
    completedAt = null;
  }

  const updated = taskStore.update(id, {
    title: updateData.title,
    description: updateData.description,
    due_date: updateData.due_date,
    priority: updateData.priority,
    status: updateData.status,
    updated_at: now,
    completed_at: completedAt,
  });

  return updated as TaskEntity;
}
