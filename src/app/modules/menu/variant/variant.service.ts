import { StatusCodes } from 'http-status-codes';
import AppError from '../../../../errors/AppError';
import QueryBuilder from '../../../builder/QueryBuilder';
import {
  generateVariantCategoryId,
  generateVariantItemId,
} from '../../../../utils/generateId';
import { IVariantCategory, IVariantItem } from './variant.interface';
import { VariantCategory, VariantItem } from './variant.model';

// ─── Variant Categories ────────────────────────────────────────────────────

const createVariantCategoryToDB = async (payload: Partial<IVariantCategory>) => {
  const existing = await VariantCategory.findOne({
    name: payload.name,
    isDeleted: { $ne: true },
  });
  if (existing) {
    throw new AppError(
      StatusCodes.CONFLICT,
      `Variant category name '${payload.name}' already exists`
    );
  }

  payload.variantCategoryId = generateVariantCategoryId();
  const category = await VariantCategory.create(payload);
  if (!category) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create variant category');
  }
  return category;
};

const getVariantCategoriesFromDB = async (query: Record<string, unknown>) => {
  const q = new QueryBuilder(VariantCategory.find(), query)
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields();
  const categories = await q.modelQuery.lean();
  const meta = await q.countTotal();

  const categoryIds = categories.map((c: any) => c._id);
  const counts = await VariantItem.aggregate([
    { $match: { variantCategoryId: { $in: categoryIds }, isDeleted: { $ne: true } } },
    { $group: { _id: '$variantCategoryId', count: { $sum: 1 } } },
  ]);
  const countMap: Record<string, number> = {};
  counts.forEach((c: any) => { countMap[c._id.toString()] = c.count; });

  const result = categories.map((c: any) => ({
    ...c,
    assignedItems: countMap[c._id.toString()] ?? 0,
  }));

  return { result, meta };
};

const getVariantCategoryByIdFromDB = async (id: string) => {
  const category = await VariantCategory.findById(id).lean();
  if (!category) throw new AppError(StatusCodes.NOT_FOUND, 'Variant category not found');
  return category;
};

const updateVariantCategoryInDB = async (id: string, payload: Partial<IVariantCategory>) => {
  if (payload.name) {
    const duplicate = await VariantCategory.findOne({
      name: payload.name,
      _id: { $ne: id },
      isDeleted: { $ne: true },
    });
    if (duplicate) {
      throw new AppError(
        StatusCodes.CONFLICT,
        `Variant category name '${payload.name}' already exists`
      );
    }
  }

  const category = await VariantCategory.findByIdAndUpdate(id, payload, { new: true });
  if (!category) throw new AppError(StatusCodes.NOT_FOUND, 'Variant category not found');
  return category;
};

const deleteVariantCategoryFromDB = async (id: string) => {
  const existing = await VariantCategory.findById(id);
  if (!existing) throw new AppError(StatusCodes.NOT_FOUND, 'Variant category not found');

  await VariantCategory.findByIdAndUpdate(id, {
    isDeleted: true,
    name: `${existing.name}_deleted_${Date.now()}`,
  });
  return null;
};

const toggleVariantCategoryStatusInDB = async (id: string) => {
  const category = await VariantCategory.findById(id);
  if (!category) throw new AppError(StatusCodes.NOT_FOUND, 'Variant category not found');
  const newStatus = category.status === 'active' ? 'inactive' : 'active';
  return VariantCategory.findByIdAndUpdate(id, { status: newStatus }, { new: true });
};

// ─── Variant Items ─────────────────────────────────────────────────────────

const createVariantItemToDB = async (payload: Partial<IVariantItem>) => {
  const existing = await VariantItem.findOne({
    name: payload.name,
    variantCategoryId: payload.variantCategoryId,
    isDeleted: { $ne: true },
  });
  if (existing) {
    throw new AppError(
      StatusCodes.CONFLICT,
      `Variant item name '${payload.name}' already exists in this category`
    );
  }

  payload.variantItemId = generateVariantItemId();
  const item = await VariantItem.create(payload);
  if (!item) throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create variant item');
  return item;
};

const getVariantItemsFromDB = async (query: Record<string, unknown>) => {
  const q = new QueryBuilder(
    VariantItem.find().populate('variantCategoryId', 'name variantCategoryId'),
    query
  )
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await q.modelQuery.lean();
  const meta = await q.countTotal();
  return { result, meta };
};

const getVariantItemByIdFromDB = async (id: string) => {
  const item = await VariantItem.findById(id)
    .populate('variantCategoryId', 'name variantCategoryId')
    .lean();
  if (!item) throw new AppError(StatusCodes.NOT_FOUND, 'Variant item not found');
  return item;
};

const updateVariantItemInDB = async (id: string, payload: Partial<IVariantItem>) => {
  if (payload.name) {
    const existing = await VariantItem.findById(id);
    const duplicate = await VariantItem.findOne({
      name: payload.name,
      variantCategoryId: payload.variantCategoryId ?? existing?.variantCategoryId,
      _id: { $ne: id },
      isDeleted: { $ne: true },
    });
    if (duplicate) {
      throw new AppError(
        StatusCodes.CONFLICT,
        `Variant item name '${payload.name}' already exists in this category`
      );
    }
  }

  const item = await VariantItem.findByIdAndUpdate(id, payload, { new: true });
  if (!item) throw new AppError(StatusCodes.NOT_FOUND, 'Variant item not found');
  return item;
};

const deleteVariantItemFromDB = async (id: string) => {
  const existing = await VariantItem.findById(id);
  if (!existing) throw new AppError(StatusCodes.NOT_FOUND, 'Variant item not found');

  await VariantItem.findByIdAndUpdate(id, {
    isDeleted: true,
    name: `${existing.name}_deleted_${Date.now()}`,
  });
  return null;
};

const toggleVariantItemStatusInDB = async (id: string) => {
  const item = await VariantItem.findById(id);
  if (!item) throw new AppError(StatusCodes.NOT_FOUND, 'Variant item not found');
  const newStatus = item.status === 'active' ? 'inactive' : 'active';
  return VariantItem.findByIdAndUpdate(id, { status: newStatus }, { new: true });
};

export const VariantService = {
  createVariantCategoryToDB,
  getVariantCategoriesFromDB,
  getVariantCategoryByIdFromDB,
  updateVariantCategoryInDB,
  deleteVariantCategoryFromDB,
  toggleVariantCategoryStatusInDB,
  createVariantItemToDB,
  getVariantItemsFromDB,
  getVariantItemByIdFromDB,
  updateVariantItemInDB,
  deleteVariantItemFromDB,
  toggleVariantItemStatusInDB,
};
