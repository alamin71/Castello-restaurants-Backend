import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { uploadToS3, uploadMultipleToS3 } from '../../../../helpers/s3Helper';
import { OfferService } from './offer.service';

const createOffer = catchAsync(async (req: Request, res: Response) => {
  const payload = { ...req.body };

  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  if (files?.mainImage?.[0]) {
    payload.mainImage = await uploadToS3(files.mainImage[0], 'offers/main');
  }
  if (files?.gallery && files.gallery.length > 0) {
    payload.gallery = await uploadMultipleToS3(files.gallery, 'offers/gallery');
  }

  const result = await OfferService.createOfferToDB(payload);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Offer created successfully',
    data: result,
  });
});

const getOffers = catchAsync(async (req: Request, res: Response) => {
  const { result, meta } = await OfferService.getOffersFromDB(
    req.query as Record<string, unknown>
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Offers retrieved successfully',
    meta,
    data: result,
  });
});

const getOfferById = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferService.getOfferByIdFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Offer retrieved successfully',
    data: result,
  });
});

const updateOffer = catchAsync(async (req: Request, res: Response) => {
  const payload = { ...req.body };

  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  if (files?.mainImage?.[0]) {
    payload.mainImage = await uploadToS3(files.mainImage[0], 'offers/main');
  }
  if (files?.gallery && files.gallery.length > 0) {
    payload.gallery = await uploadMultipleToS3(files.gallery, 'offers/gallery');
  }

  const result = await OfferService.updateOfferInDB(req.params.id as string, payload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Offer updated successfully',
    data: result,
  });
});

const deleteOffer = catchAsync(async (req: Request, res: Response) => {
  await OfferService.deleteOfferFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Offer deleted successfully',
    data: null,
  });
});

const toggleOfferStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferService.toggleOfferStatusInDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Offer status updated successfully',
    data: result,
  });
});

export const OfferController = {
  createOffer,
  getOffers,
  getOfferById,
  updateOffer,
  deleteOffer,
  toggleOfferStatus,
};
