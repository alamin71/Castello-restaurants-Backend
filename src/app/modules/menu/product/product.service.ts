import { StatusCodes } from 'http-status-codes';
import AppError from '../../../../errors/AppError';
import QueryBuilder from '../../../builder/QueryBuilder';
import { generateProductId } from '../../../../utils/generateId';
import { deleteFromS3 } from '../../../../helpers/s3Helper';
import { IProduct, IVariantInput } from './product.interface';
import { Product, ProductVariant } from './product.model';
import { ToppingCategory } from '../topping/topping.model';
import { ToppingItem } from '../topping/topping.model';

const createProductToDB = async (
  payload: Partial<IProduct>,
  variants?: IVariantInput[]
) => {
  payload.productId = await generateProductId();

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
    .search(['name', 'description', 'productId'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const products = await productQuery.modelQuery.lean();
  const meta = await productQuery.countTotal();

  const productIds = products.map((p: any) => p._id);

  // Batch fetch variants
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

  // Batch fetch topping categories and items
  const allToppingCatIds = [...new Set(products.flatMap((p: any) => p.toppingCategoryIds ?? []).map(String))];
  const allDefaultItemIds = [...new Set(products.flatMap((p: any) => p.defaultToppingItemIds ?? []).map(String))];

  const [toppingCats, defaultItems] = await Promise.all([
    ToppingCategory.find({ _id: { $in: allToppingCatIds } }, 'name toppingCategoryId').lean(),
    ToppingItem.find({ _id: { $in: allDefaultItemIds } }, 'name toppingItemId price').lean(),
  ]);

  const toppingCatMap: Record<string, any> = {};
  toppingCats.forEach((c: any) => { toppingCatMap[c._id.toString()] = c; });

  const defaultItemMap: Record<string, any> = {};
  defaultItems.forEach((i: any) => { defaultItemMap[i._id.toString()] = i; });

  const result = products.map((p: any) => ({
    ...p,
    variants: variantMap[p._id.toString()] || [],
    toppingCategoryIds: (p.toppingCategoryIds ?? []).map((id: any) => toppingCatMap[id.toString()] ?? id),
    defaultToppingItemIds: (p.defaultToppingItemIds ?? []).map((id: any) => defaultItemMap[id.toString()] ?? id),
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
  variants?: IVariantInput[],
  newGalleryUrls?: string[],
  removeGallery?: string[]
) => {
  // Step 1: update scalar fields + pull removed gallery URLs
  const updateOp: Record<string, any> = { $set: payload };
  if (removeGallery && removeGallery.length > 0) {
    updateOp.$pull = { gallery: { $in: removeGallery } };
    // Fire-and-forget S3 deletes (non-fatal)
    Promise.all(removeGallery.map((url) => deleteFromS3(url)));
  }

  let product = await Product.findByIdAndUpdate(id, updateOp, { new: true });
  if (!product) throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');

  // Step 2: append new gallery URLs (must be separate op — can't $pull + $push same field)
  if (newGalleryUrls && newGalleryUrls.length > 0) {
    product = (await Product.findByIdAndUpdate(
      id,
      { $push: { gallery: { $each: newGalleryUrls } } },
      { new: true }
    ))!;
  }

  if (variants && variants.length > 0) {
    await ProductVariant.deleteMany({ productId: id });
    const variantDocs = variants.map((v) => ({
      productId:         product!._id,
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
