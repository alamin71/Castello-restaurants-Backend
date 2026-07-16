import { StatusCodes } from 'http-status-codes';
import AppError from '../../../../errors/AppError';
import QueryBuilder from '../../../builder/QueryBuilder';
import { generateDiscountId } from '../../../../utils/generateId';
import { IDiscount } from './discount.interface';
import { Discount } from './discount.model';

const createDiscountToDB = async (payload: Partial<IDiscount>) => {
  payload.discountId = await generateDiscountId();
  const discount = await Discount.create(payload);
  if (!discount) throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create discount');
  return discount;
};

const getDiscountsFromDB = async (query: Record<string, unknown>) => {
  const q = new QueryBuilder(Discount.find(), query)
    .search(['name', 'discountId'])
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await q.modelQuery.lean();
  const meta = await q.countTotal();
  return { result, meta };
};

const getDiscountByIdFromDB = async (id: string) => {
  const discount = await Discount.findById(id)
    .populate('applicableProducts.productId', 'name productId mainImage')
    .populate('applicableProducts.variantItemIds', 'name variantItemId')
    .lean();
  if (!discount) throw new AppError(StatusCodes.NOT_FOUND, 'Discount not found');
  return discount;
};

const updateDiscountInDB = async (id: string, payload: Partial<IDiscount>) => {
  const discount = await Discount.findByIdAndUpdate(id, payload, { new: true });
  if (!discount) throw new AppError(StatusCodes.NOT_FOUND, 'Discount not found');
  return discount;
};

const deleteDiscountFromDB = async (id: string) => {
  const discount = await Discount.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  if (!discount) throw new AppError(StatusCodes.NOT_FOUND, 'Discount not found');
  return null;
};

const toggleDiscountStatusInDB = async (id: string) => {
  const discount = await Discount.findById(id);
  if (!discount) throw new AppError(StatusCodes.NOT_FOUND, 'Discount not found');
  const newStatus = discount.status === 'active' ? 'inactive' : 'active';
  return Discount.findByIdAndUpdate(id, { status: newStatus }, { new: true });
};

export const DiscountService = {
  createDiscountToDB,
  getDiscountsFromDB,
  getDiscountByIdFromDB,
  updateDiscountInDB,
  deleteDiscountFromDB,
  toggleDiscountStatusInDB,
};
