import express from 'express';
import auth from '../../../middleware/auth';
import validateRequest from '../../../middleware/validateRequest';
import { s3FileUploadHandler } from '../../../middleware/s3FileUploadHandler';
import { OfferCategoryValidation } from './offerCategory.validation';
import { OfferCategoryController } from './offerCategory.controller';

const router = express.Router();

router.post(
  '/',
  auth('admin', 'superAdmin'),
  s3FileUploadHandler.fields([{ name: 'image', maxCount: 1 }]),
  validateRequest(OfferCategoryValidation.createOfferCategorySchema),
  OfferCategoryController.createOfferCategory
);

router.get('/', OfferCategoryController.getOfferCategories);

router.patch(
  '/reorder',
  auth('admin', 'superAdmin'),
  validateRequest(OfferCategoryValidation.reorderOfferCategorySchema),
  OfferCategoryController.reorderOfferCategories
);

router.get('/:id', OfferCategoryController.getOfferCategoryById);

router.patch(
  '/:id',
  auth('admin', 'superAdmin'),
  s3FileUploadHandler.fields([{ name: 'image', maxCount: 1 }]),
  validateRequest(OfferCategoryValidation.updateOfferCategorySchema),
  OfferCategoryController.updateOfferCategory
);

router.patch(
  '/:id/toggle-status',
  auth('admin', 'superAdmin'),
  OfferCategoryController.toggleOfferCategoryStatus
);

router.delete(
  '/:id',
  auth('admin', 'superAdmin'),
  OfferCategoryController.deleteOfferCategory
);

export const OfferCategoryRouter = router;
