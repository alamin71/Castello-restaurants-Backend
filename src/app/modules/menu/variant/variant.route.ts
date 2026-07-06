import express from 'express';
import { USER_ROLES } from '../../../../enums/user';
import auth from '../../../middleware/auth';
import validateRequest from '../../../middleware/validateRequest';
import { s3FileUploadHandler } from '../../../middleware/s3FileUploadHandler';
import { VariantController } from './variant.controller';
import { VariantValidation } from './variant.validation';

const router = express.Router();

// ─── Variant Categories ────────────────────────────────────────────────────
router.get('/categories', VariantController.getVariantCategories);
router.get('/categories/:id', VariantController.getVariantCategoryById);

router.post(
  '/categories',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  s3FileUploadHandler.fields([{ name: 'image', maxCount: 1 }]),
  validateRequest(VariantValidation.createVariantCategorySchema),
  VariantController.createVariantCategory
);

router.patch(
  '/categories/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  s3FileUploadHandler.fields([{ name: 'image', maxCount: 1 }]),
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
  s3FileUploadHandler.none(),
  validateRequest(VariantValidation.createVariantItemSchema),
  VariantController.createVariantItem
);

router.patch(
  '/items/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  s3FileUploadHandler.none(),
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
