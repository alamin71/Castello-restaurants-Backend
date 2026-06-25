import { model, Schema } from 'mongoose';
import { IToppingCategory, IToppingItem } from './topping.interface';

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

const toppingCategorySchema = new Schema<IToppingCategory>(
  {
    toppingCategoryId: { type: String, required: true, unique: true },
    name:              { type: String, required: true, unique: true, trim: true },
    status:            { type: String, enum: ['active', 'inactive'], default: 'active' },
    isDeleted:         { type: Boolean, default: false },
  },
  { timestamps: true }
);
addSoftDeleteHooks(toppingCategorySchema);
toppingCategorySchema.index({ name: 'text' });

const toppingItemSchema = new Schema<IToppingItem>(
  {
    toppingItemId:     { type: String, required: true, unique: true },
    name:              { type: String, required: true, trim: true },
    toppingCategoryId: { type: Schema.Types.ObjectId, ref: 'ToppingCategory', required: true },
    price:             { type: Number, required: true, min: 0 },
    status:            { type: String, enum: ['active', 'inactive'], default: 'active' },
    isDeleted:         { type: Boolean, default: false },
  },
  { timestamps: true }
);
addSoftDeleteHooks(toppingItemSchema);
toppingItemSchema.index({ toppingCategoryId: 1, status: 1 });

export const ToppingCategory = model<IToppingCategory>('ToppingCategory', toppingCategorySchema);
export const ToppingItem = model<IToppingItem>('ToppingItem', toppingItemSchema);
