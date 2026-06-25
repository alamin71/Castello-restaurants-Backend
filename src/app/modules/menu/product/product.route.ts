import express from 'express';
import { USER_ROLES } from '../../../../enums/user';
import auth from '../../../middleware/auth';
import validateRequest from '../../../middleware/validateRequest';
import { s3FileUploadHandler } from '../../../middleware/s3FileUploadHandler';
import { ProductController } from './product.controller';
import { ProductValidation } from './product.validation';

const router = express.Router();

const productUpload = s3FileUploadHandler.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'gallery',   maxCount: 5 },
]);

router.get('/', ProductController.getProducts);
router.get('/:id', ProductController.getProductById);

router.post(
  '/',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  productUpload,
  validateRequest(ProductValidation.createProductSchema),
  ProductController.createProduct
);

router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  productUpload,
  validateRequest(ProductValidation.updateProductSchema),
  ProductController.updateProduct
);

router.delete(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  ProductController.deleteProduct
);

router.patch(
  '/:id/status',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  ProductController.toggleProductStatus
);

export const ProductRouter = router;
