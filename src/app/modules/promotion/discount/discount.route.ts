import express from 'express';
import { USER_ROLES } from '../../../../enums/user';
import auth from '../../../middleware/auth';
import validateRequest from '../../../middleware/validateRequest';
import { s3FileUploadHandler } from '../../../middleware/s3FileUploadHandler';
import { DiscountController } from './discount.controller';
import { DiscountValidation } from './discount.validation';

const router = express.Router();

router.get('/', DiscountController.getDiscounts);
router.get('/:id', DiscountController.getDiscountById);

router.post(
  '/',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  s3FileUploadHandler.none(),
  validateRequest(DiscountValidation.createDiscountSchema),
  DiscountController.createDiscount
);

router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  s3FileUploadHandler.none(),
  validateRequest(DiscountValidation.updateDiscountSchema),
  DiscountController.updateDiscount
);

router.delete(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  DiscountController.deleteDiscount
);

router.patch(
  '/:id/status',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  DiscountController.toggleDiscountStatus
);

export const DiscountRouter = router;
