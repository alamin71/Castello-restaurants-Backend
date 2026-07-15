import { StatusCodes } from 'http-status-codes';
import AppError from '../../../../errors/AppError';
import QueryBuilder from '../../../builder/QueryBuilder';
import { generateCouponId } from '../../../../utils/generateId';
import { ICoupon } from './coupon.interface';
import { Coupon } from './coupon.model';

const createCouponToDB = async (payload: Partial<ICoupon>) => {
  const existing = await Coupon.findOne({ code: payload.code?.toUpperCase() });
  if (existing) {
    throw new AppError(StatusCodes.CONFLICT, `Coupon code '${payload.code}' already exists`);
  }

  payload.couponId = await generateCouponId();
  const coupon = await Coupon.create(payload);
  if (!coupon) throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create coupon');
  return coupon;
};

const getCouponsFromDB = async (query: Record<string, unknown>) => {
  const q = new QueryBuilder(Coupon.find(), query)
    .search(['name', 'code', 'couponId'])
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await q.modelQuery.lean();
  const meta = await q.countTotal();
  return { result, meta };
};

const getCouponByIdFromDB = async (id: string) => {
  const coupon = await Coupon.findById(id)
    .populate('applicableProducts.productId', 'name productId mainImage')
    .populate('applicableProducts.variantItemIds', 'name variantItemId')
    .lean();
  if (!coupon) throw new AppError(StatusCodes.NOT_FOUND, 'Coupon not found');
  return coupon;
};

const updateCouponInDB = async (id: string, payload: Partial<ICoupon>) => {
  if (payload.code) {
    const duplicate = await Coupon.findOne({
      code: payload.code.toUpperCase(),
      _id: { $ne: id },
    });
    if (duplicate) {
      throw new AppError(StatusCodes.CONFLICT, `Coupon code '${payload.code}' already exists`);
    }
  }

  const coupon = await Coupon.findByIdAndUpdate(id, payload, { new: true });
  if (!coupon) throw new AppError(StatusCodes.NOT_FOUND, 'Coupon not found');
  return coupon;
};

const deleteCouponFromDB = async (id: string) => {
  const coupon = await Coupon.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  if (!coupon) throw new AppError(StatusCodes.NOT_FOUND, 'Coupon not found');
  return null;
};

const toggleCouponStatusInDB = async (id: string) => {
  const coupon = await Coupon.findById(id);
  if (!coupon) throw new AppError(StatusCodes.NOT_FOUND, 'Coupon not found');
  const newStatus = coupon.status === 'active' ? 'inactive' : 'active';
  return Coupon.findByIdAndUpdate(id, { status: newStatus }, { new: true });
};

export const CouponService = {
  createCouponToDB,
  getCouponsFromDB,
  getCouponByIdFromDB,
  updateCouponInDB,
  deleteCouponFromDB,
  toggleCouponStatusInDB,
};
