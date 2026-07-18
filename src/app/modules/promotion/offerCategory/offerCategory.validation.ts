import { z } from 'zod';

const createOfferCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Offer category name is required'),
  }),
});

const updateOfferCategorySchema = z.object({
  body: z.object({
    name:   z.string().min(1).optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

const reorderOfferCategorySchema = z.object({
  body: z.object({
    orderedIds: z.array(z.string()).min(1, 'orderedIds is required'),
  }),
});

export const OfferCategoryValidation = {
  createOfferCategorySchema,
  updateOfferCategorySchema,
  reorderOfferCategorySchema,
};
