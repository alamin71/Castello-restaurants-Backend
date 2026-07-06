import { StatusCodes } from 'http-status-codes';
import AppError from '../../../../errors/AppError';
import QueryBuilder from '../../../builder/QueryBuilder';
import {
  generateToppingCategoryId,
  generateToppingItemId,
} from '../../../../utils/generateId';
import { IToppingCategory, IToppingItem } from './topping.interface';
import { ToppingCategory, ToppingItem } from './topping.model';

// ─── Topping Categories ────────────────────────────────────────────────────

const createToppingCategoryToDB = async (payload: Partial<IToppingCategory>) => {
  const existing = await ToppingCategory.findOne({
    name: payload.name,
    isDeleted: { $ne: true },
  });
  if (existing) {
    throw new AppError(StatusCodes.CONFLICT, `Topping category name '${payload.name}' already exists`);
  }

  payload.toppingCategoryId = generateToppingCategoryId();
  const category = await ToppingCategory.create(payload);
  if (!category) throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create topping category');
  return category;
};

const getToppingCategoriesFromDB = async (query: Record<string, unknown>) => {
  const q = new QueryBuilder(ToppingCategory.find(), query)
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields();
  const categories = await q.modelQuery.lean();
  const meta = await q.countTotal();

  const categoryIds = categories.map((c: any) => c._id);
  const counts = await ToppingItem.aggregate([
    { $match: { toppingCategoryId: { $in: categoryIds }, isDeleted: { $ne: true } } },
    { $group: { _id: '$toppingCategoryId', count: { $sum: 1 } } },
  ]);
  const countMap: Record<string, number> = {};
  counts.forEach((c: any) => { countMap[c._id.toString()] = c.count; });

  const result = categories.map((c: any) => ({
    ...c,
    assignedItems: countMap[c._id.toString()] ?? 0,
  }));

  return { result, meta };
};

const getToppingCategoryByIdFromDB = async (id: string) => {
  const category = await ToppingCategory.findById(id).lean();
  if (!category) throw new AppError(StatusCodes.NOT_FOUND, 'Topping category not found');
  return category;
};

const updateToppingCategoryInDB = async (id: string, payload: Partial<IToppingCategory>) => {
  if (payload.name) {
    const duplicate = await ToppingCategory.findOne({
      name: payload.name,
      _id: { $ne: id },
      isDeleted: { $ne: true },
    });
    if (duplicate) {
      throw new AppError(StatusCodes.CONFLICT, `Topping category name '${payload.name}' already exists`);
    }
  }

  const category = await ToppingCategory.findByIdAndUpdate(id, payload, { new: true });
  if (!category) throw new AppError(StatusCodes.NOT_FOUND, 'Topping category not found');
  return category;
};

const deleteToppingCategoryFromDB = async (id: string) => {
  const existing = await ToppingCategory.findById(id);
  if (!existing) throw new AppError(StatusCodes.NOT_FOUND, 'Topping category not found');

  await ToppingCategory.findByIdAndUpdate(id, {
    isDeleted: true,
    name: `${existing.name}_deleted_${Date.now()}`,
  });
  return null;
};

const toggleToppingCategoryStatusInDB = async (id: string) => {
  const category = await ToppingCategory.findById(id);
  if (!category) throw new AppError(StatusCodes.NOT_FOUND, 'Topping category not found');
  const newStatus = category.status === 'active' ? 'inactive' : 'active';
  return ToppingCategory.findByIdAndUpdate(id, { status: newStatus }, { new: true });
};

// ─── Topping Items ─────────────────────────────────────────────────────────

const createToppingItemToDB = async (payload: Partial<IToppingItem>) => {
  const existing = await ToppingItem.findOne({
    name: payload.name,
    toppingCategoryId: payload.toppingCategoryId,
    isDeleted: { $ne: true },
  });
  if (existing) {
    throw new AppError(StatusCodes.CONFLICT, `Topping item name '${payload.name}' already exists in this category`);
  }

  payload.toppingItemId = generateToppingItemId();
  const item = await ToppingItem.create(payload);
  if (!item) throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create topping item');
  return item;
};

const getToppingItemsFromDB = async (query: Record<string, unknown>) => {
  const q = new QueryBuilder(
    ToppingItem.find().populate('toppingCategoryId', 'name toppingCategoryId'),
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

const getToppingItemByIdFromDB = async (id: string) => {
  const item = await ToppingItem.findById(id)
    .populate('toppingCategoryId', 'name toppingCategoryId')
    .lean();
  if (!item) throw new AppError(StatusCodes.NOT_FOUND, 'Topping item not found');
  return item;
};

const updateToppingItemInDB = async (id: string, payload: Partial<IToppingItem>) => {
  if (payload.name) {
    const existing = await ToppingItem.findById(id);
    const duplicate = await ToppingItem.findOne({
      name: payload.name,
      toppingCategoryId: payload.toppingCategoryId ?? existing?.toppingCategoryId,
      _id: { $ne: id },
      isDeleted: { $ne: true },
    });
    if (duplicate) {
      throw new AppError(StatusCodes.CONFLICT, `Topping item name '${payload.name}' already exists in this category`);
    }
  }

  const item = await ToppingItem.findByIdAndUpdate(id, payload, { new: true });
  if (!item) throw new AppError(StatusCodes.NOT_FOUND, 'Topping item not found');
  return item;
};

const deleteToppingItemFromDB = async (id: string) => {
  const existing = await ToppingItem.findById(id);
  if (!existing) throw new AppError(StatusCodes.NOT_FOUND, 'Topping item not found');

  await ToppingItem.findByIdAndUpdate(id, {
    isDeleted: true,
    name: `${existing.name}_deleted_${Date.now()}`,
  });
  return null;
};

const toggleToppingItemStatusInDB = async (id: string) => {
  const item = await ToppingItem.findById(id);
  if (!item) throw new AppError(StatusCodes.NOT_FOUND, 'Topping item not found');
  const newStatus = item.status === 'active' ? 'inactive' : 'active';
  return ToppingItem.findByIdAndUpdate(id, { status: newStatus }, { new: true });
};

export const ToppingService = {
  createToppingCategoryToDB,
  getToppingCategoriesFromDB,
  getToppingCategoryByIdFromDB,
  updateToppingCategoryInDB,
  deleteToppingCategoryFromDB,
  toggleToppingCategoryStatusInDB,
  createToppingItemToDB,
  getToppingItemsFromDB,
  getToppingItemByIdFromDB,
  updateToppingItemInDB,
  deleteToppingItemFromDB,
  toggleToppingItemStatusInDB,
};
