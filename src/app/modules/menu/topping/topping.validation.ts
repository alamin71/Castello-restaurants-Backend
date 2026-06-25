import { z } from 'zod';

const createToppingCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Topping category name is required'),
  }),
});

const updateToppingCategorySchema = z.object({
  body: z.object({
    name:   z.string().min(1).optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

const createToppingItemSchema = z.object({
  body: z.object({
    name:              z.string().min(1, 'Topping item name is required'),
    toppingCategoryId: z.string().min(1, 'Topping category is required'),
    price:             z.preprocess(Number, z.number().min(0, 'Price must be 0 or greater')),
  }),
});

const updateToppingItemSchema = z.object({
  body: z.object({
    name:              z.string().min(1).optional(),
    toppingCategoryId: z.string().optional(),
    price:             z.preprocess(Number, z.number().min(0)).optional(),
    status:            z.enum(['active', 'inactive']).optional(),
  }),
});

export const ToppingValidation = {
  createToppingCategorySchema,
  updateToppingCategorySchema,
  createToppingItemSchema,
  updateToppingItemSchema,
};
