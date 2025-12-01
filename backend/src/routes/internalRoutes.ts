/**
 * @summary
 * Internal API routes configuration.
 * Handles authenticated endpoints for business operations.
 *
 * @module routes/internalRoutes
 */

import { Router } from 'express';
import { authMiddleware } from '@/middleware';
import * as initExampleController from '@/api/internal/init-example/controller';
import * as taskController from '@/api/internal/task/controller';
import * as taskDetailController from '@/api/internal/task/detail/controller';

const router = Router();

/**
 * @rule {be-route-configuration}
 * Init-Example routes - /api/internal/init-example
 */
router.get('/init-example', initExampleController.listHandler);
router.post('/init-example', initExampleController.createHandler);
router.get('/init-example/:id', initExampleController.getHandler);
router.put('/init-example/:id', initExampleController.updateHandler);
router.delete('/init-example/:id', initExampleController.deleteHandler);

/**
 * @rule {be-route-configuration}
 * Task routes - /api/internal/task
 */
router.post('/task', authMiddleware, taskController.createHandler);
router.get('/task/:id', authMiddleware, taskDetailController.getHandler);
router.put('/task/:id', authMiddleware, taskDetailController.updateHandler);

export default router;
