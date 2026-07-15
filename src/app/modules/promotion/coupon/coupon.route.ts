import express from 'express';
import { USER_ROLES } from '../../../../enums/user';
import auth from '../../../middleware/auth';
import validateRequest from '../../../middleware/validateRequest';
import { s3FileUploadHandler } from '../../../middleware/s3FileUploadHandler';
import { CouponController } from './coupon.controller';
import { CouponValidation } from './coupon.validation';

const router = express.Router();

router.get('/', CouponController.getCoupons);
router.get('/:id', CouponController.getCouponById);

router.post(
  '/',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  s3FileUploadHandler.none(),
  validateRequest(CouponValidation.createCouponSchema),
  CouponController.createCoupon
);

router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  s3FileUploadHandler.none(),
  validateRequest(CouponValidation.updateCouponSchema),
  CouponController.updateCoupon
);

router.delete(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  CouponController.deleteCoupon
);

router.patch(
  '/:id/status',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  CouponController.toggleCouponStatus
);

export const CouponRouter = router;
