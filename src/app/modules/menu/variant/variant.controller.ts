import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { uploadToS3 } from '../../../../helpers/s3Helper';
import { VariantService } from './variant.service';

// ─── Variant Categories ────────────────────────────────────────────────────

const createVariantCategory = catchAsync(async (req: Request, res: Response) => {
  const payload = { ...req.body };
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  if (files?.image?.[0]) {
    payload.image = await uploadToS3(files.image[0], 'variant-categories');
  }
  const result = await VariantService.createVariantCategoryToDB(payload);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Variant category created successfully',
    data: result,
  });
});

const getVariantCategories = catchAsync(async (req: Request, res: Response) => {
  const { result, meta } = await VariantService.getVariantCategoriesFromDB(
    req.query as Record<string, unknown>
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Variant categories retrieved successfully',
    meta,
    data: result,
  });
});

const getVariantCategoryById = catchAsync(async (req: Request, res: Response) => {
  const result = await VariantService.getVariantCategoryByIdFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Variant category retrieved successfully',
    data: result,
  });
});

const updateVariantCategory = catchAsync(async (req: Request, res: Response) => {
  const payload = { ...req.body };
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  if (files?.image?.[0]) {
    payload.image = await uploadToS3(files.image[0], 'variant-categories');
  }
  const result = await VariantService.updateVariantCategoryInDB(req.params.id as string, payload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Variant category updated successfully',
    data: result,
  });
});

const deleteVariantCategory = catchAsync(async (req: Request, res: Response) => {
  await VariantService.deleteVariantCategoryFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Variant category deleted successfully',
    data: null,
  });
});

const toggleVariantCategoryStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await VariantService.toggleVariantCategoryStatusInDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Variant category status updated successfully',
    data: result,
  });
});

// ─── Variant Items ─────────────────────────────────────────────────────────

const createVariantItem = catchAsync(async (req: Request, res: Response) => {
  const result = await VariantService.createVariantItemToDB(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Variant item created successfully',
    data: result,
  });
});

const getVariantItems = catchAsync(async (req: Request, res: Response) => {
  const { result, meta } = await VariantService.getVariantItemsFromDB(
    req.query as Record<string, unknown>
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Variant items retrieved successfully',
    meta,
    data: result,
  });
});

const getVariantItemById = catchAsync(async (req: Request, res: Response) => {
  const result = await VariantService.getVariantItemByIdFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Variant item retrieved successfully',
    data: result,
  });
});

const updateVariantItem = catchAsync(async (req: Request, res: Response) => {
  const result = await VariantService.updateVariantItemInDB(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Variant item updated successfully',
    data: result,
  });
});

const deleteVariantItem = catchAsync(async (req: Request, res: Response) => {
  await VariantService.deleteVariantItemFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Variant item deleted successfully',
    data: null,
  });
});

const toggleVariantItemStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await VariantService.toggleVariantItemStatusInDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Variant item status updated successfully',
    data: result,
  });
});

export const VariantController = {
  createVariantCategory,
  getVariantCategories,
  getVariantCategoryById,
  updateVariantCategory,
  deleteVariantCategory,
  toggleVariantCategoryStatus,
  createVariantItem,
  getVariantItems,
  getVariantItemById,
  updateVariantItem,
  deleteVariantItem,
  toggleVariantItemStatus,
};
