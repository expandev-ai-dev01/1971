import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { taskService } from '../../services/taskService';
import { useNavigation } from '@/core/hooks/useNavigation';
import type { UpdateTaskDto } from '../../types';

export const useTaskUpdate = (taskId: string) => {
  const queryClient = useQueryClient();
  const { navigate } = useNavigation();

  return useMutation({
    mutationFn: (data: UpdateTaskDto) => taskService.update(taskId, data),
    onSuccess: () => {
      toast.success('Tarefa atualizada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      navigate('/');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao atualizar tarefa';
      toast.error(message);
    },
  });
};
