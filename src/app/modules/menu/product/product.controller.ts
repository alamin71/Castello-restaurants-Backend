import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { uploadToS3, uploadMultipleToS3 } from '../../../../helpers/s3Helper';
import { ProductService } from './product.service';
import { IVariantInput } from './product.interface';

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const payload = { ...req.body };

  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  if (files?.mainImage?.[0]) {
    payload.mainImage = await uploadToS3(files.mainImage[0], 'products/main');
  }
  if (files?.gallery && files.gallery.length > 0) {
    payload.gallery = await uploadMultipleToS3(files.gallery, 'products/gallery');
  }

  const variants: IVariantInput[] | undefined = payload.variants;
  delete payload.variants;

  const result = await ProductService.createProductToDB(payload, variants);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Product created successfully',
    data: result,
  });
});

const getProducts = catchAsync(async (req: Request, res: Response) => {
  const { result, meta } = await ProductService.getProductsFromDB(
    req.query as Record<string, unknown>
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Products retrieved successfully',
    meta,
    data: result,
  });
});

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getProductByIdFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product retrieved successfully',
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const payload = { ...req.body };

  // Parse removeGallery — can arrive as a single string or array from form-data
  const removeGallery: string[] = payload.removeGallery
    ? Array.isArray(payload.removeGallery)
      ? payload.removeGallery
      : [payload.removeGallery]
    : [];
  delete payload.removeGallery;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  if (files?.mainImage?.[0]) {
    payload.mainImage = await uploadToS3(files.mainImage[0], 'products/main');
  }

  // Upload new gallery files — do NOT put in payload (service handles append)
  const newGalleryUrls: string[] =
    files?.gallery && files.gallery.length > 0
      ? await uploadMultipleToS3(files.gallery, 'products/gallery')
      : [];
  delete payload.gallery;

  const variants: IVariantInput[] | undefined = payload.variants;
  delete payload.variants;

  const result = await ProductService.updateProductInDB(
    req.params.id as string,
    payload,
    variants,
    newGalleryUrls,
    removeGallery,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product updated successfully',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  await ProductService.deleteProductFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product deleted successfully',
    data: null,
  });
});

const toggleProductStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.toggleProductStatusInDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product status updated successfully',
    data: result,
  });
});

export const ProductController = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
};
