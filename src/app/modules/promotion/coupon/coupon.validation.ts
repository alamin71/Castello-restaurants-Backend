import { z } from 'zod';

const applicableProductSchema = z.object({
  productId:      z.string().min(1),
  variantItemIds: z.array(z.string()).optional().default([]),
});

const createCouponSchema = z.object({
  body: z.object({
    name:               z.string().min(1, 'Coupon name is required'),
    code:               z.string().min(1, 'Coupon code is required'),
    discountMethod:     z.enum(['percent', 'amount']),
    discountValue:      z.preprocess(Number, z.number().min(0)),
    minimumOrder:       z.preprocess(Number, z.number().min(0)),
    startDate:          z.preprocess((v) => new Date(v as string), z.date()),
    expireDate:         z.preprocess((v) => new Date(v as string), z.date()),
    isApplicableForAll: z.preprocess(
      (v) => v === 'true' || v === true,
      z.boolean().optional().default(true)
    ),
    applicableProducts: z.preprocess(
      (v) => (typeof v === 'string' ? JSON.parse(v) : v),
      z.array(applicableProductSchema).optional().default([])
    ),
  }),
});

const updateCouponSchema = z.object({
  body: z.object({
    name:               z.string().min(1).optional(),
    code:               z.string().min(1).optional(),
    discountMethod:     z.enum(['percent', 'amount']).optional(),
    discountValue:      z.preprocess(Number, z.number().min(0)).optional(),
    minimumOrder:       z.preprocess(Number, z.number().min(0)).optional(),
    startDate:          z.preprocess((v) => v ? new Date(v as string) : undefined, z.date().optional()),
    expireDate:         z.preprocess((v) => v ? new Date(v as string) : undefined, z.date().optional()),
    isApplicableForAll: z.preprocess(
      (v) => v === 'true' || v === true,
      z.boolean().optional()
    ),
    applicableProducts: z.preprocess(
      (v) => (typeof v === 'string' ? JSON.parse(v) : v),
      z.array(applicableProductSchema).optional()
    ),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

export const CouponValidation = {
  createCouponSchema,
  updateCouponSchema,
};
