import { z } from 'zod';

const variantInputSchema = z.object({
  variantCategoryId: z.string().min(1),
  variantItemId:     z.string().min(1),
  price:             z.preprocess(Number, z.number().min(0)),
  status:            z.enum(['active', 'inactive']).optional().default('active'),
});

const createProductSchema = z.object({
  body: z.object({
    name:                  z.string().min(1, 'Product name is required'),
    description:           z.string().optional().default(''),
    categoryId:            z.string().min(1, 'Category is required'),
    type:                  z.enum(['single', 'variant']),
    price:                 z.preprocess(Number, z.number().min(0)).optional(),
    toppingCategoryIds:    z.preprocess(
      (v) => (typeof v === 'string' ? JSON.parse(v) : v),
      z.array(z.string()).optional().default([])
    ),
    defaultToppingItemIds: z.preprocess(
      (v) => (typeof v === 'string' ? JSON.parse(v) : v),
      z.array(z.string()).optional().default([])
    ),
    variants: z.preprocess(
      (v) => (typeof v === 'string' ? JSON.parse(v) : v),
      z.array(variantInputSchema).optional()
    ),
    availability: z.preprocess(
      (v) => (typeof v === 'string' ? JSON.parse(v) : v),
      z.object({
        website: z.boolean().optional().default(true),
        pos:     z.boolean().optional().default(true),
        kiosk:   z.boolean().optional().default(true),
      }).optional()
    ),
  }).refine(
    (data) => {
      if (data.type === 'single' && (data.price === undefined || data.price === null)) return false;
      return true;
    },
    { message: 'Price is required for single type products', path: ['price'] }
  ).refine(
    (data) => {
      if (data.type === 'variant' && (!data.variants || data.variants.length === 0)) return false;
      return true;
    },
    { message: 'At least one variant is required for variant type products', path: ['variants'] }
  ),
});

const updateProductSchema = z.object({
  body: z.object({
    name:                  z.string().min(1).optional(),
    description:           z.string().optional(),
    categoryId:            z.string().optional(),
    type:                  z.enum(['single', 'variant']).optional(),
    price:                 z.preprocess(Number, z.number().min(0)).optional(),
    toppingCategoryIds:    z.preprocess(
      (v) => (typeof v === 'string' ? JSON.parse(v) : v),
      z.array(z.string()).optional()
    ),
    defaultToppingItemIds: z.preprocess(
      (v) => (typeof v === 'string' ? JSON.parse(v) : v),
      z.array(z.string()).optional()
    ),
    variants: z.preprocess(
      (v) => (typeof v === 'string' ? JSON.parse(v) : v),
      z.array(variantInputSchema).optional()
    ),
    availability: z.preprocess(
      (v) => (typeof v === 'string' ? JSON.parse(v) : v),
      z.object({
        website: z.boolean().optional(),
        pos:     z.boolean().optional(),
        kiosk:   z.boolean().optional(),
      }).optional()
    ),
    status:        z.enum(['active', 'inactive']).optional(),
    removeGallery: z.union([z.string(), z.array(z.string())]).optional(),
  }),
});

export const ProductValidation = {
  createProductSchema,
  updateProductSchema,
};
