import express from 'express';
import auth from '../../../middleware/auth';
import validateRequest from '../../../middleware/validateRequest';
import { s3FileUploadHandler } from '../../../middleware/s3FileUploadHandler';
import { USER_ROLES } from '../../../../enums/user';
import { OfferCategoryValidation } from './offerCategory.validation';
import { OfferCategoryController } from './offerCategory.controller';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  s3FileUploadHandler.fields([{ name: 'image', maxCount: 1 }]),
  validateRequest(OfferCategoryValidation.createOfferCategorySchema),
  OfferCategoryController.createOfferCategory
);

router.get('/', OfferCategoryController.getOfferCategories);

router.patch(
  '/reorder',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(OfferCategoryValidation.reorderOfferCategorySchema),
  OfferCategoryController.reorderOfferCategories
);

router.get('/:id', OfferCategoryController.getOfferCategoryById);

router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  s3FileUploadHandler.fields([{ name: 'image', maxCount: 1 }]),
  validateRequest(OfferCategoryValidation.updateOfferCategorySchema),
  OfferCategoryController.updateOfferCategory
);

router.patch(
  '/:id/toggle-status',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  OfferCategoryController.toggleOfferCategoryStatus
);

router.delete(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  OfferCategoryController.deleteOfferCategory
);

export const OfferCategoryRouter = router;
