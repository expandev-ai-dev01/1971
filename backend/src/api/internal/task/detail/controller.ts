/**
 * @summary
 * API controller for Task detail operations.
 * Handles HTTP requests for retrieving and updating specific tasks.
 *
 * @module api/internal/task/detail/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import { taskGet, taskUpdate } from '@/services/task';

/**
 * @api {get} /api/internal/task/:id Get Task
 * @apiName GetTask
 * @apiGroup Task
 *
 * @apiHeader {String} x-user-id User Identifier (UUID)
 *
 * @apiParam {String} id Task ID (UUID)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.task_id Unique task identifier
 * @apiSuccess {String} data.user_id Owner identifier
 * @apiSuccess {String} data.title Task title
 * @apiSuccess {String|null} data.description Task description
 * @apiSuccess {String|null} data.due_date Due date (ISO 8601)
 * @apiSuccess {String} data.priority Priority level (Baixa | Média | Alta)
 * @apiSuccess {String} data.status Task status (Pendente | Em andamento | Concluída | Cancelada)
 * @apiSuccess {String} data.created_at Creation timestamp
 * @apiSuccess {String} data.updated_at Last update timestamp
 * @apiSuccess {String|null} data.completed_at Completion timestamp
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR | UNAUTHORIZED)
 * @apiError {String} error.message Error message
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = (req as any).user.id;
    const data = await taskGet(userId, req.params);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {put} /api/internal/task/:id Update Task
 * @apiName UpdateTask
 * @apiGroup Task
 *
 * @apiHeader {String} x-user-id User Identifier (UUID)
 *
 * @apiParam {String} id Task ID (UUID)
 *
 * @apiBody {String} title Task title (3-100 chars)
 * @apiBody {String} [description] Task description (max 500 chars)
 * @apiBody {String} [due_date] Due date (ISO 8601)
 * @apiBody {String} priority Priority level (Baixa | Média | Alta)
 * @apiBody {String} status Task status (Pendente | Em andamento | Concluída | Cancelada)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.task_id Unique task identifier
 * @apiSuccess {String} data.user_id Owner identifier
 * @apiSuccess {String} data.title Task title
 * @apiSuccess {String|null} data.description Task description
 * @apiSuccess {String|null} data.due_date Due date
 * @apiSuccess {String} data.priority Priority level
 * @apiSuccess {String} data.status Task status
 * @apiSuccess {String} data.created_at Creation timestamp
 * @apiSuccess {String} data.updated_at Last update timestamp
 * @apiSuccess {String|null} data.completed_at Completion timestamp
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR | UNAUTHORIZED)
 * @apiError {String} error.message Error message
 */
export async function updateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = (req as any).user.id;
    const data = await taskUpdate(userId, req.params, req.body);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
