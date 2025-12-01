import { TaskForm } from '@/domain/task/components/TaskForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/card';

function TaskCreatePage() {
  return (
    <div className="mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Nova Tarefa</CardTitle>
          <CardDescription>Preencha os dados abaixo para criar uma nova tarefa.</CardDescription>
        </CardHeader>
        <CardContent>
          <TaskForm />
        </CardContent>
      </Card>
    </div>
  );
}

export { TaskCreatePage };
