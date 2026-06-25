import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { ToppingService } from './topping.service';

// ─── Topping Categories ────────────────────────────────────────────────────

const createToppingCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await ToppingService.createToppingCategoryToDB(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Topping category created successfully',
    data: result,
  });
});

const getToppingCategories = catchAsync(async (req: Request, res: Response) => {
  const { result, meta } = await ToppingService.getToppingCategoriesFromDB(
    req.query as Record<string, unknown>
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Topping categories retrieved successfully',
    meta,
    data: result,
  });
});

const getToppingCategoryById = catchAsync(async (req: Request, res: Response) => {
  const result = await ToppingService.getToppingCategoryByIdFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Topping category retrieved successfully',
    data: result,
  });
});

const updateToppingCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await ToppingService.updateToppingCategoryInDB(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Topping category updated successfully',
    data: result,
  });
});

const deleteToppingCategory = catchAsync(async (req: Request, res: Response) => {
  await ToppingService.deleteToppingCategoryFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Topping category deleted successfully',
    data: null,
  });
});

const toggleToppingCategoryStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await ToppingService.toggleToppingCategoryStatusInDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Topping category status updated successfully',
    data: result,
  });
});

// ─── Topping Items ─────────────────────────────────────────────────────────

const createToppingItem = catchAsync(async (req: Request, res: Response) => {
  const result = await ToppingService.createToppingItemToDB(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Topping item created successfully',
    data: result,
  });
});

const getToppingItems = catchAsync(async (req: Request, res: Response) => {
  const { result, meta } = await ToppingService.getToppingItemsFromDB(
    req.query as Record<string, unknown>
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Topping items retrieved successfully',
    meta,
    data: result,
  });
});

const getToppingItemById = catchAsync(async (req: Request, res: Response) => {
  const result = await ToppingService.getToppingItemByIdFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Topping item retrieved successfully',
    data: result,
  });
});

const updateToppingItem = catchAsync(async (req: Request, res: Response) => {
  const result = await ToppingService.updateToppingItemInDB(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Topping item updated successfully',
    data: result,
  });
});

const deleteToppingItem = catchAsync(async (req: Request, res: Response) => {
  await ToppingService.deleteToppingItemFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Topping item deleted successfully',
    data: null,
  });
});

const toggleToppingItemStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await ToppingService.toggleToppingItemStatusInDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Topping item status updated successfully',
    data: result,
  });
});

export const ToppingController = {
  createToppingCategory,
  getToppingCategories,
  getToppingCategoryById,
  updateToppingCategory,
  deleteToppingCategory,
  toggleToppingCategoryStatus,
  createToppingItem,
  getToppingItems,
  getToppingItemById,
  updateToppingItem,
  deleteToppingItem,
  toggleToppingItemStatus,
};
