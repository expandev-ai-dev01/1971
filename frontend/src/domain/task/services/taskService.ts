import { authenticatedClient } from '@/core/lib/api';
import type { CreateTaskDto, Task } from '../types';

export const taskService = {
  /**
   * Creates a new task
   * @param data Task creation data
   * @returns Created task
   */
  async create(data: CreateTaskDto): Promise<Task> {
    const response = await authenticatedClient.post('/task', data);
    return response.data.data;
  },
};
