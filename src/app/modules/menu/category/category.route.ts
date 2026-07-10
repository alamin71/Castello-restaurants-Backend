import express from 'express';
import { USER_ROLES } from '../../../../enums/user';
import auth from '../../../middleware/auth';
import validateRequest from '../../../middleware/validateRequest';
import { s3FileUploadHandler } from '../../../middleware/s3FileUploadHandler';
import { CategoryController } from './category.controller';
import { CategoryValidation } from './category.validation';

const router = express.Router();

router.get('/', CategoryController.getCategories);

router.post(
  '/',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  s3FileUploadHandler.fields([{ name: 'image', maxCount: 1 }]),
  validateRequest(CategoryValidation.createCategorySchema),
  CategoryController.createCategory
);

router.patch(
  '/reorder',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(CategoryValidation.reorderCategorySchema),
  CategoryController.reorderCategories
);

router.get('/:id', CategoryController.getCategoryById);

router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  s3FileUploadHandler.fields([{ name: 'image', maxCount: 1 }]),
  validateRequest(CategoryValidation.updateCategorySchema),
  CategoryController.updateCategory
);

router.delete(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  CategoryController.deleteCategory
);

router.patch(
  '/:id/status',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  CategoryController.toggleCategoryStatus
);

export const CategoryRouter = router;
