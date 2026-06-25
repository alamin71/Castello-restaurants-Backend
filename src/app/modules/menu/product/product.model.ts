import { model, Schema } from 'mongoose';
import { IProduct, IProductVariant } from './product.interface';

const productSchema = new Schema<IProduct>(
  {
    productId:    { type: String, required: true, unique: true },
    name:         { type: String, required: true, trim: true },
    description:  { type: String, default: '' },
    categoryId:   { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    type:         { type: String, enum: ['single', 'variant'], required: true },
    price:        { type: Number, min: 0 },
    mainImage:    { type: String, default: '' },
    gallery:      [{ type: String }],
    toppingCategoryIds:  [{ type: Schema.Types.ObjectId, ref: 'ToppingCategory' }],
    defaultToppingItemIds: [{ type: Schema.Types.ObjectId, ref: 'ToppingItem' }],
    availability: {
      website: { type: Boolean, default: true },
      pos:     { type: Boolean, default: true },
      kiosk:   { type: Boolean, default: true },
    },
    status:    { type: String, enum: ['active', 'inactive'], default: 'active' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
productSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
productSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ categoryId: 1, status: 1, isDeleted: 1 });
productSchema.index({ 'availability.website': 1 });
productSchema.index({ 'availability.kiosk': 1 });

const productVariantSchema = new Schema<IProductVariant>(
  {
    productId:         { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variantCategoryId: { type: Schema.Types.ObjectId, ref: 'VariantCategory', required: true },
    variantItemId:     { type: Schema.Types.ObjectId, ref: 'VariantItem', required: true },
    price:             { type: Number, required: true, min: 0 },
    status:            { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);
productVariantSchema.index({ productId: 1 });
productVariantSchema.index({ productId: 1, variantItemId: 1 }, { unique: true });

export const Product = model<IProduct>('Product', productSchema);
export const ProductVariant = model<IProductVariant>('ProductVariant', productVariantSchema);
