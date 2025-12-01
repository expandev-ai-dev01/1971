import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DOMPurify from 'dompurify';
import { formatISO } from 'date-fns';
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
import { createTaskSchema } from '../../validations/task';
import { useTaskCreate } from '../../hooks/useTaskCreate';
import type { CreateTaskFormInput, CreateTaskFormOutput } from '../../types';

function TaskForm() {
  const { mutate: createTask, isPending } = useTaskCreate();

  const form = useForm<CreateTaskFormInput, any, CreateTaskFormOutput>({
    resolver: zodResolver(createTaskSchema),
    mode: 'onBlur',
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = (data: CreateTaskFormOutput) => {
    const sanitizedData = {
      title: DOMPurify.sanitize(data.title),
      description: data.description ? DOMPurify.sanitize(data.description) : undefined,
      due_date: data.due_date ? formatISO(data.due_date) : undefined,
    };

    createTask(sanitizedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
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
                <Textarea placeholder="Detalhes da tarefa..." className="resize-none" {...field} />
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

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Criando...' : 'Criar Tarefa'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export { TaskForm };
