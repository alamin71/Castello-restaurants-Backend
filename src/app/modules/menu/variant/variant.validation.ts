import { z } from 'zod';

const createVariantCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Variant category name is required'),
  }),
});

const updateVariantCategorySchema = z.object({
  body: z.object({
    name:   z.string().min(1).optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

const createVariantItemSchema = z.object({
  body: z.object({
    name:              z.string().min(1, 'Variant item name is required'),
    variantCategoryId: z.string().min(1, 'Variant category is required'),
  }),
});

const updateVariantItemSchema = z.object({
  body: z.object({
    name:              z.string().min(1).optional(),
    variantCategoryId: z.string().optional(),
    status:            z.enum(['active', 'inactive']).optional(),
  }),
});

export const VariantValidation = {
  createVariantCategorySchema,
  updateVariantCategorySchema,
  createVariantItemSchema,
  updateVariantItemSchema,
};
