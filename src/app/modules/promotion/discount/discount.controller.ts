import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { DiscountService } from './discount.service';

const createDiscount = catchAsync(async (req: Request, res: Response) => {
  const result = await DiscountService.createDiscountToDB(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Discount created successfully',
    data: result,
  });
});

const getDiscounts = catchAsync(async (req: Request, res: Response) => {
  const { result, meta } = await DiscountService.getDiscountsFromDB(
    req.query as Record<string, unknown>
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Discounts retrieved successfully',
    meta,
    data: result,
  });
});

const getDiscountById = catchAsync(async (req: Request, res: Response) => {
  const result = await DiscountService.getDiscountByIdFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Discount retrieved successfully',
    data: result,
  });
});

const updateDiscount = catchAsync(async (req: Request, res: Response) => {
  const result = await DiscountService.updateDiscountInDB(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Discount updated successfully',
    data: result,
  });
});

const deleteDiscount = catchAsync(async (req: Request, res: Response) => {
  await DiscountService.deleteDiscountFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Discount deleted successfully',
    data: null,
  });
});

const toggleDiscountStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await DiscountService.toggleDiscountStatusInDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Discount status updated successfully',
    data: result,
  });
});

export const DiscountController = {
  createDiscount,
  getDiscounts,
  getDiscountById,
  updateDiscount,
  deleteDiscount,
  toggleDiscountStatus,
};
