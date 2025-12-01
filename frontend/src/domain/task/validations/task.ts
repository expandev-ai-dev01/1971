import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z
    .string('O título é obrigatório')
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(100, 'O título não pode exceder 100 caracteres'),
  description: z.string().max(500, 'A descrição não pode exceder 500 caracteres').optional(),
  due_date: z
    .date()
    .optional()
    .refine((date) => !date || date > new Date(), 'A data de vencimento não pode ser no passado'),
});
