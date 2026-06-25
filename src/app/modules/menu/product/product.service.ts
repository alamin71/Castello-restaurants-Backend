import { StatusCodes } from 'http-status-codes';
import AppError from '../../../../errors/AppError';
import QueryBuilder from '../../../builder/QueryBuilder';
import { generateProductId } from '../../../../utils/generateId';
import { IProduct, IVariantInput } from './product.interface';
import { Product, ProductVariant } from './product.model';
import { ToppingCategory } from '../topping/topping.model';
import { ToppingItem } from '../topping/topping.model';

const createProductToDB = async (
  payload: Partial<IProduct>,
  variants?: IVariantInput[]
) => {
  payload.productId = generateProductId();

  const product = await Product.create(payload);
  if (!product) throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create product');

  if (payload.type === 'variant' && variants && variants.length > 0) {
    const variantDocs = variants.map((v) => ({
      productId:         product._id,
      variantCategoryId: v.variantCategoryId,
      variantItemId:     v.variantItemId,
      price:             v.price,
      status:            v.status ?? 'active',
    }));
    await ProductVariant.insertMany(variantDocs);
  }

  return product;
};

const getProductsFromDB = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(
    Product.find().populate('categoryId', 'name categoryId'),
    query
  )
    .search(['name', 'description'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const products = await productQuery.modelQuery.lean();
  const meta = await productQuery.countTotal();

  const productIds = products.map((p: any) => p._id);
  const allVariants = await ProductVariant.find({ productId: { $in: productIds } })
    .populate('variantCategoryId', 'name')
    .populate('variantItemId', 'name')
    .lean();

  const variantMap: Record<string, any[]> = {};
  allVariants.forEach((v: any) => {
    const key = v.productId.toString();
    if (!variantMap[key]) variantMap[key] = [];
    variantMap[key].push(v);
  });

  const result = products.map((p: any) => ({
    ...p,
    variants: variantMap[p._id.toString()] || [],
  }));

  return { result, meta };
};

const getProductByIdFromDB = async (id: string) => {
  const product = await Product.findById(id)
    .populate('categoryId', 'name categoryId image')
    .lean();
  if (!product) throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');

  const variants = await ProductVariant.find({ productId: id })
    .populate('variantCategoryId', 'name variantCategoryId')
    .populate('variantItemId', 'name variantItemId')
    .lean();

  const toppingCategories = await ToppingCategory.find({
    _id: { $in: (product as any).toppingCategoryIds },
    status: 'active',
  }).lean();

  const toppingCategoryIds = toppingCategories.map((c: any) => c._id);
  const toppingItems = await ToppingItem.find({
    toppingCategoryId: { $in: toppingCategoryIds },
    status: 'active',
  }).lean();

  const toppingsByCategory = toppingCategories.map((cat: any) => ({
    ...cat,
    items: toppingItems.filter(
      (item: any) => item.toppingCategoryId.toString() === cat._id.toString()
    ),
  }));

  return {
    ...product,
    variants,
    toppingCategories: toppingsByCategory,
  };
};

const updateProductInDB = async (
  id: string,
  payload: Partial<IProduct>,
  variants?: IVariantInput[]
) => {
  const product = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');

  if (variants && variants.length > 0) {
    await ProductVariant.deleteMany({ productId: id });
    const variantDocs = variants.map((v) => ({
      productId:         product._id,
      variantCategoryId: v.variantCategoryId,
      variantItemId:     v.variantItemId,
      price:             v.price,
    }));
    await ProductVariant.insertMany(variantDocs);
  }

  return product;
};

const deleteProductFromDB = async (id: string) => {
  const product = await Product.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!product) throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
  return null;
};

const toggleProductStatusInDB = async (id: string) => {
  const product = await Product.findById(id);
  if (!product) throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
  const newStatus = product.status === 'active' ? 'inactive' : 'active';
  return Product.findByIdAndUpdate(id, { status: newStatus }, { new: true });
};

export const ProductService = {
  createProductToDB,
  getProductsFromDB,
  getProductByIdFromDB,
  updateProductInDB,
  deleteProductFromDB,
  toggleProductStatusInDB,
};
