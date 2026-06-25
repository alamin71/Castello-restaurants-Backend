import { z } from 'zod';

const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Category name is required'),
  }),
});

const updateCategorySchema = z.object({
  body: z.object({
    name:   z.string().min(1).optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

export const CategoryValidation = {
  createCategorySchema,
  updateCategorySchema,
};
