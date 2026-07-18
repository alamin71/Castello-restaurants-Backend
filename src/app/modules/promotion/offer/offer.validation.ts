import { z } from 'zod';

const offerProductSlotSchema = z.object({
  productId:      z.string().min(1),
  variantItemIds: z.array(z.string()).optional().default([]),
});

const offerItemSchema = z.object({
  categoryId: z.string().min(1),
  isFixed:    z.boolean().optional().default(false),
  products:   z.array(offerProductSlotSchema).optional().default([]),
});

const createOfferSchema = z.object({
  body: z.object({
    title:           z.string().min(1, 'Offer title is required'),
    description:     z.string().optional().default(''),
    price:           z.preprocess(Number, z.number().min(0, 'Price is required')),
    offerCategoryId: z.string().optional(),
    offerItems: z.preprocess(
      (v) => (typeof v === 'string' ? JSON.parse(v) : v),
      z.array(offerItemSchema).min(1, 'At least one offer item is required')
    ),
    availability: z.preprocess(
      (v) => (typeof v === 'string' ? JSON.parse(v) : v),
      z.object({
        website: z.boolean().optional().default(true),
        pos:     z.boolean().optional().default(true),
        kiosk:   z.boolean().optional().default(false),
      }).optional()
    ),
    availableFor: z.preprocess(
      (v) => (typeof v === 'string' ? JSON.parse(v) : v),
      z.object({
        homeDelivery: z.boolean().optional().default(true),
        takeaway:     z.boolean().optional().default(true),
      }).optional()
    ),
  }),
});

const updateOfferSchema = z.object({
  body: z.object({
    title:           z.string().min(1).optional(),
    description:     z.string().optional(),
    price:           z.preprocess(Number, z.number().min(0)).optional(),
    offerCategoryId: z.string().optional(),
    offerItems: z.preprocess(
      (v) => (typeof v === 'string' ? JSON.parse(v) : v),
      z.array(offerItemSchema).optional()
    ),
    availability: z.preprocess(
      (v) => (typeof v === 'string' ? JSON.parse(v) : v),
      z.object({
        website: z.boolean().optional(),
        pos:     z.boolean().optional(),
        kiosk:   z.boolean().optional(),
      }).optional()
    ),
    availableFor: z.preprocess(
      (v) => (typeof v === 'string' ? JSON.parse(v) : v),
      z.object({
        homeDelivery: z.boolean().optional(),
        takeaway:     z.boolean().optional(),
      }).optional()
    ),
    status:        z.enum(['active', 'inactive']).optional(),
    removeGallery: z.union([z.string(), z.array(z.string())]).optional(),
  }),
});

export const OfferValidation = {
  createOfferSchema,
  updateOfferSchema,
};
