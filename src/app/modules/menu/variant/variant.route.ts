import express from 'express';
import { USER_ROLES } from '../../../../enums/user';
import auth from '../../../middleware/auth';
import validateRequest from '../../../middleware/validateRequest';
import { VariantController } from './variant.controller';
import { VariantValidation } from './variant.validation';

const router = express.Router();

// ─── Variant Categories ────────────────────────────────────────────────────
router.get('/categories', VariantController.getVariantCategories);
router.get('/categories/:id', VariantController.getVariantCategoryById);

router.post(
  '/categories',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(VariantValidation.createVariantCategorySchema),
  VariantController.createVariantCategory
);

router.patch(
  '/categories/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(VariantValidation.updateVariantCategorySchema),
  VariantController.updateVariantCategory
);

router.delete(
  '/categories/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  VariantController.deleteVariantCategory
);

router.patch(
  '/categories/:id/status',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  VariantController.toggleVariantCategoryStatus
);

// ─── Variant Items ─────────────────────────────────────────────────────────
router.get('/items', VariantController.getVariantItems);
router.get('/items/:id', VariantController.getVariantItemById);

router.post(
  '/items',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(VariantValidation.createVariantItemSchema),
  VariantController.createVariantItem
);

router.patch(
  '/items/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(VariantValidation.updateVariantItemSchema),
  VariantController.updateVariantItem
);

router.delete(
  '/items/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  VariantController.deleteVariantItem
);

router.patch(
  '/items/:id/status',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  VariantController.toggleVariantItemStatus
);

export const VariantRouter = router;
