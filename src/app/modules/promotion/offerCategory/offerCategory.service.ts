import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../../../errors/AppError';
import QueryBuilder from '../../../builder/QueryBuilder';
import { generateOfferCategoryId } from '../../../../utils/generateId';
import { IOfferCategory } from './offerCategory.interface';
import { OfferCategory } from './offerCategory.model';
import { Offer } from '../offer/offer.model';

const createOfferCategoryToDB = async (payload: Partial<IOfferCategory>) => {
  const existing = await OfferCategory.findOne({ name: payload.name, isDeleted: { $ne: true } });
  if (existing) {
    throw new AppError(StatusCodes.CONFLICT, `Offer category name '${payload.name}' already exists`);
  }
  payload.offerCategoryId = await generateOfferCategoryId();
  const category = await OfferCategory.create(payload);
  if (!category) throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create offer category');
  return category;
};

const getOfferCategoriesFromDB = async (query: Record<string, unknown>) => {
  const q = new QueryBuilder(OfferCategory.find().sort({ sortOrder: 1 }), query)
    .search(['name', 'offerCategoryId'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const categories = await q.modelQuery.lean();
  const meta = await q.countTotal();

  const categoryIds = categories.map((c: any) => c._id);
  const counts = await Offer.aggregate([
    { $match: { offerCategoryId: { $in: categoryIds }, isDeleted: { $ne: true } } },
    { $group: { _id: '$offerCategoryId', count: { $sum: 1 } } },
  ]);
  const countMap: Record<string, number> = {};
  counts.forEach((c: any) => { countMap[c._id.toString()] = c.count; });

  const result = categories.map((c: any) => ({
    ...c,
    assignedOffers: countMap[c._id.toString()] ?? 0,
  }));

  return { result, meta };
};

const getOfferCategoryByIdFromDB = async (id: string) => {
  const category = await OfferCategory.findById(id).lean();
  if (!category) throw new AppError(StatusCodes.NOT_FOUND, 'Offer category not found');
  return category;
};

const updateOfferCategoryInDB = async (id: string, payload: Partial<IOfferCategory>) => {
  if (payload.name) {
    const duplicate = await OfferCategory.findOne({
      name: payload.name,
      _id: { $ne: id },
      isDeleted: { $ne: true },
    });
    if (duplicate) {
      throw new AppError(StatusCodes.CONFLICT, `Offer category name '${payload.name}' already exists`);
    }
  }
  const category = await OfferCategory.findByIdAndUpdate(id, payload, { new: true });
  if (!category) throw new AppError(StatusCodes.NOT_FOUND, 'Offer category not found');
  return category;
};

const deleteOfferCategoryFromDB = async (id: string) => {
  const existing = await OfferCategory.findById(id);
  if (!existing) throw new AppError(StatusCodes.NOT_FOUND, 'Offer category not found');
  await OfferCategory.findByIdAndUpdate(id, {
    isDeleted: true,
    name: `${existing.name}_deleted_${Date.now()}`,
  });
  return null;
};

const toggleOfferCategoryStatusInDB = async (id: string) => {
  const category = await OfferCategory.findById(id);
  if (!category) throw new AppError(StatusCodes.NOT_FOUND, 'Offer category not found');
  const newStatus = category.status === 'active' ? 'inactive' : 'active';
  return OfferCategory.findByIdAndUpdate(id, { status: newStatus }, { new: true });
};

const reorderOfferCategoriesInDB = async (orderedIds: string[]) => {
  const bulkOps = orderedIds.map((id, index) => ({
    updateOne: {
      filter: { _id: new mongoose.Types.ObjectId(id) },
      update: { $set: { sortOrder: index } },
    },
  }));
  await OfferCategory.bulkWrite(bulkOps);
};

export const OfferCategoryService = {
  createOfferCategoryToDB,
  getOfferCategoriesFromDB,
  getOfferCategoryByIdFromDB,
  updateOfferCategoryInDB,
  deleteOfferCategoryFromDB,
  toggleOfferCategoryStatusInDB,
  reorderOfferCategoriesInDB,
};
