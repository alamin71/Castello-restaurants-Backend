import express from 'express';
import { USER_ROLES } from '../../../../enums/user';
import auth from '../../../middleware/auth';
import validateRequest from '../../../middleware/validateRequest';
import { s3FileUploadHandler } from '../../../middleware/s3FileUploadHandler';
import { OfferController } from './offer.controller';
import { OfferValidation } from './offer.validation';

const router = express.Router();

const offerUpload = s3FileUploadHandler.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'gallery',   maxCount: 5 },
]);

router.get('/', OfferController.getOffers);
router.get('/:id', OfferController.getOfferById);

router.post(
  '/',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  offerUpload,
  validateRequest(OfferValidation.createOfferSchema),
  OfferController.createOffer
);

router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  offerUpload,
  validateRequest(OfferValidation.updateOfferSchema),
  OfferController.updateOffer
);

router.delete(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  OfferController.deleteOffer
);

router.patch(
  '/:id/status',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  OfferController.toggleOfferStatus
);

export const OfferRouter = router;
