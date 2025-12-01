import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DOMPurify from 'dompurify';
import { formatISO, parseISO } from 'date-fns';
import { Button } from '@/core/components/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/core/components/form';
import { Input } from '@/core/components/input';
import { Textarea } from '@/core/components/textarea';
import { DatePicker } from '@/core/components/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/core/components/alert-dialog';
import { updateTaskSchema } from '../../validations/task';
import { useTaskUpdate } from '../../hooks/useTaskUpdate';
import { useNavigation } from '@/core/hooks/useNavigation';
import type { UpdateTaskFormInput, UpdateTaskFormOutput, Task } from '../../types';
import { useState } from 'react';

interface TaskEditFormProps {
  task: Task;
}

function TaskEditForm({ task }: TaskEditFormProps) {
  const { mutate: updateTask, isPending } = useTaskUpdate(task.task_id);
  const { navigate } = useNavigation();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const form = useForm<UpdateTaskFormInput, any, UpdateTaskFormOutput>({
    resolver: zodResolver(updateTaskSchema),
    mode: 'onBlur',
    defaultValues: {
      title: task.title,
      description: task.description || '',
      due_date: task.due_date ? parseISO(task.due_date) : undefined,
      priority: task.priority,
      status: task.status,
    },
  });

  const currentStatus = form.watch('status');

  useEffect(() => {
    if (
      currentStatus !== task.status &&
      (currentStatus === 'Concluída' || task.status === 'Concluída')
    ) {
      setPendingStatus(currentStatus);
      setShowStatusDialog(true);
    }
  }, [currentStatus, task.status]);

  const handleStatusConfirm = () => {
    setShowStatusDialog(false);
    setPendingStatus(null);
  };

  const handleStatusCancel = () => {
    form.setValue('status', task.status);
    setShowStatusDialog(false);
    setPendingStatus(null);
  };

  const onSubmit = (data: UpdateTaskFormOutput) => {
    const sanitizedData = {
      title: DOMPurify.sanitize(data.title),
      description: data.description ? DOMPurify.sanitize(data.description) : undefined,
      due_date: data.due_date ? formatISO(data.due_date) : undefined,
      priority: data.priority,
      status: data.status,
    };

    updateTask(sanitizedData);
  };

  const handleCancel = () => {
    if (form.formState.isDirty) {
      setShowCancelDialog(true);
    } else {
      navigate('/');
    }
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    navigate('/');
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título *</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Comprar mantimentos" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Detalhes da tarefa..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Vencimento</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    onDateChange={field.onChange}
                    placeholder="Selecione uma data"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioridade *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Baixa">Baixa</SelectItem>
                    <SelectItem value="Média">Média</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Em andamento">Em andamento</SelectItem>
                    <SelectItem value="Concluída">Concluída</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </Form>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Descartar alterações?</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem alterações não salvas. Tem certeza que deseja descartar essas alterações?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCancelDialog(false)}>
              Continuar editando
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel}>Descartar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar alteração de status</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingStatus === 'Concluída'
                ? 'Você está marcando esta tarefa como concluída. A data de conclusão será registrada automaticamente.'
                : 'Você está alterando o status de uma tarefa concluída. A data de conclusão será removida.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleStatusCancel}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusConfirm}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export { TaskEditForm };
