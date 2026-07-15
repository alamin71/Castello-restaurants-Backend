import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { CouponService } from './coupon.service';

const createCoupon = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponService.createCouponToDB(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Coupon created successfully',
    data: result,
  });
});

const getCoupons = catchAsync(async (req: Request, res: Response) => {
  const { result, meta } = await CouponService.getCouponsFromDB(
    req.query as Record<string, unknown>
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Coupons retrieved successfully',
    meta,
    data: result,
  });
});

const getCouponById = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponService.getCouponByIdFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Coupon retrieved successfully',
    data: result,
  });
});

const updateCoupon = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponService.updateCouponInDB(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Coupon updated successfully',
    data: result,
  });
});

const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
  await CouponService.deleteCouponFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Coupon deleted successfully',
    data: null,
  });
});

const toggleCouponStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponService.toggleCouponStatusInDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Coupon status updated successfully',
    data: result,
  });
});

export const CouponController = {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
};
