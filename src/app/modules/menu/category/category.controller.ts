import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { uploadToS3 } from '../../../../helpers/s3Helper';
import { CategoryService } from './category.service';

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const payload = { ...req.body };

  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  if (files?.image?.[0]) {
    payload.image = await uploadToS3(files.image[0], 'categories');
  }

  const result = await CategoryService.createCategoryToDB(payload);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const getCategories = catchAsync(async (req: Request, res: Response) => {
  const { result, meta } = await CategoryService.getCategoriesFromDB(
    req.query as Record<string, unknown>
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Categories retrieved successfully',
    meta,
    data: result,
  });
});

const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getCategoryByIdFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Category retrieved successfully',
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const payload = { ...req.body };
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  if (files?.image?.[0]) {
    payload.image = await uploadToS3(files.image[0], 'categories');
  }
  const result = await CategoryService.updateCategoryInDB(req.params.id as string, payload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Category updated successfully',
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  await CategoryService.deleteCategoryFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Category deleted successfully',
    data: null,
  });
});

const toggleCategoryStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.toggleCategoryStatusInDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Category status updated successfully',
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
};
