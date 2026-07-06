import { StatusCodes } from 'http-status-codes';
import AppError from '../../../../errors/AppError';
import QueryBuilder from '../../../builder/QueryBuilder';
import { generateCategoryId } from '../../../../utils/generateId';
import { ICategory } from './category.interface';
import { Category } from './category.model';
import { Product } from '../product/product.model';

const createCategoryToDB = async (payload: Partial<ICategory>) => {
  const existing = await Category.findOne({
    name: payload.name,
    isDeleted: { $ne: true },
  });
  if (existing) {
    throw new AppError(
      StatusCodes.CONFLICT,
      `Category name '${payload.name}' already exists`
    );
  }

  payload.categoryId = generateCategoryId();
  const category = await Category.create(payload);
  if (!category) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create category');
  }
  return category;
};

const getCategoriesFromDB = async (query: Record<string, unknown>) => {
  const categoryQuery = new QueryBuilder(Category.find(), query)
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const categories = await categoryQuery.modelQuery.lean();
  const meta = await categoryQuery.countTotal();

  // attach assignedProducts count for each category
  const categoryIds = categories.map((c: any) => c._id);
  const counts = await Product.aggregate([
    { $match: { categoryId: { $in: categoryIds }, isDeleted: { $ne: true } } },
    { $group: { _id: '$categoryId', count: { $sum: 1 } } },
  ]);
  const countMap: Record<string, number> = {};
  counts.forEach((c: any) => { countMap[c._id.toString()] = c.count; });

  const result = categories.map((c: any) => ({
    ...c,
    assignedProducts: countMap[c._id.toString()] ?? 0,
  }));

  return { result, meta };
};

const getCategoryByIdFromDB = async (id: string) => {
  const category = await Category.findById(id).lean();
  if (!category) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Category not found');
  }
  return category;
};

const updateCategoryInDB = async (id: string, payload: Partial<ICategory>) => {
  // Check if another active category already has the same name
  if (payload.name) {
    const duplicate = await Category.findOne({
      name: payload.name,
      _id: { $ne: id },
      isDeleted: { $ne: true },
    });
    if (duplicate) {
      throw new AppError(
        StatusCodes.CONFLICT,
        `Category name '${payload.name}' already exists`
      );
    }
  }

  const category = await Category.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!category) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Category not found');
  }
  return category;
};

const deleteCategoryFromDB = async (id: string) => {
  const existing = await Category.findById(id);
  if (!existing) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Category not found');
  }

  // Free up the name so it can be reused after deletion
  await Category.findByIdAndUpdate(id, {
    isDeleted: true,
    name: `${existing.name}_deleted_${Date.now()}`,
  });

  return null;
};

const toggleCategoryStatusInDB = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Category not found');
  }
  const newStatus = category.status === 'active' ? 'inactive' : 'active';
  return Category.findByIdAndUpdate(id, { status: newStatus }, { new: true });
};

export const CategoryService = {
  createCategoryToDB,
  getCategoriesFromDB,
  getCategoryByIdFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
  toggleCategoryStatusInDB,
};
