import { z } from 'zod';

export const TodoSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
});

export type TodoType = z.infer<typeof TodoSchema>;