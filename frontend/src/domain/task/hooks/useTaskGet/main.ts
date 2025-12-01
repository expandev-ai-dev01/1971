import { useQuery } from '@tanstack/react-query';
import { taskService } from '../../services/taskService';

export const useTaskGet = (id: string) => {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => taskService.getById(id),
    enabled: !!id,
  });
};
