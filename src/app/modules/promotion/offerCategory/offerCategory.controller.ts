import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { uploadToS3 } from '../../../../helpers/s3Helper';
import { OfferCategoryService } from './offerCategory.service';

const createOfferCategory = catchAsync(async (req: Request, res: Response) => {
  const payload = { ...req.body };
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  if (files?.image?.[0]) {
    payload.image = await uploadToS3(files.image[0], 'offer-categories');
  }
  const result = await OfferCategoryService.createOfferCategoryToDB(payload);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Offer category created successfully',
    data: result,
  });
});

const getOfferCategories = catchAsync(async (req: Request, res: Response) => {
  const { result, meta } = await OfferCategoryService.getOfferCategoriesFromDB(
    req.query as Record<string, unknown>
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Offer categories retrieved successfully',
    meta,
    data: result,
  });
});

const getOfferCategoryById = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferCategoryService.getOfferCategoryByIdFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Offer category retrieved successfully',
    data: result,
  });
});

const updateOfferCategory = catchAsync(async (req: Request, res: Response) => {
  const payload = { ...req.body };
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  if (files?.image?.[0]) {
    payload.image = await uploadToS3(files.image[0], 'offer-categories');
  }
  const result = await OfferCategoryService.updateOfferCategoryInDB(req.params.id as string, payload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Offer category updated successfully',
    data: result,
  });
});

const deleteOfferCategory = catchAsync(async (req: Request, res: Response) => {
  await OfferCategoryService.deleteOfferCategoryFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Offer category deleted successfully',
    data: null,
  });
});

const toggleOfferCategoryStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferCategoryService.toggleOfferCategoryStatusInDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Offer category status updated successfully',
    data: result,
  });
});

const reorderOfferCategories = catchAsync(async (req: Request, res: Response) => {
  await OfferCategoryService.reorderOfferCategoriesInDB(req.body.orderedIds);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Offer categories reordered successfully',
    data: null,
  });
});

export const OfferCategoryController = {
  createOfferCategory,
  getOfferCategories,
  getOfferCategoryById,
  updateOfferCategory,
  deleteOfferCategory,
  toggleOfferCategoryStatus,
  reorderOfferCategories,
};
