import { model, Schema } from 'mongoose';
import { IVariantCategory, IVariantItem } from './variant.interface';

const addSoftDeleteHooks = (schema: Schema) => {
  schema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
  });
  schema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
  });
  schema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
  });
};

const variantCategorySchema = new Schema<IVariantCategory>(
  {
    variantCategoryId: { type: String, required: true, unique: true },
    name:              { type: String, required: true, unique: true, trim: true },
    status:            { type: String, enum: ['active', 'inactive'], default: 'active' },
    isDeleted:         { type: Boolean, default: false },
  },
  { timestamps: true }
);
addSoftDeleteHooks(variantCategorySchema);
variantCategorySchema.index({ name: 'text' });

const variantItemSchema = new Schema<IVariantItem>(
  {
    variantItemId:     { type: String, required: true, unique: true },
    name:              { type: String, required: true, trim: true },
    variantCategoryId: { type: Schema.Types.ObjectId, ref: 'VariantCategory', required: true },
    status:            { type: String, enum: ['active', 'inactive'], default: 'active' },
    isDeleted:         { type: Boolean, default: false },
  },
  { timestamps: true }
);
addSoftDeleteHooks(variantItemSchema);
variantItemSchema.index({ variantCategoryId: 1, status: 1 });

export const VariantCategory = model<IVariantCategory>('VariantCategory', variantCategorySchema);
export const VariantItem = model<IVariantItem>('VariantItem', variantItemSchema);
