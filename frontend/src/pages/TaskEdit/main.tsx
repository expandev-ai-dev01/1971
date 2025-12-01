import { useParams } from 'react-router-dom';
import { TaskEditForm } from '@/domain/task/components/TaskEditForm';
import { useTaskGet } from '@/domain/task/hooks/useTaskGet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/card';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/core/components/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/core/components/button';
import { useNavigation } from '@/core/hooks/useNavigation';

function TaskEditPage() {
  const { id } = useParams<{ id: string }>();
  const { navigate } = useNavigation();
  const { data: task, isLoading, error } = useTaskGet(id || '');

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="mx-auto max-w-2xl py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar tarefa</AlertTitle>
          <AlertDescription>
            Não foi possível carregar os dados da tarefa. Por favor, tente novamente.
          </AlertDescription>
        </Alert>
        <div className="mt-4 flex justify-center">
          <Button onClick={() => navigate('/')}>Voltar para o início</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Editar Tarefa</CardTitle>
          <CardDescription>
            Atualize os dados da tarefa. Campos marcados com * são obrigatórios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TaskEditForm task={task} />
        </CardContent>
      </Card>
    </div>
  );
}

export { TaskEditPage };
