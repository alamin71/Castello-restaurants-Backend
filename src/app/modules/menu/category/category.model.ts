import { model, Schema } from 'mongoose';
import { ICategory } from './category.interface';

const categorySchema = new Schema<ICategory>(
  {
    categoryId: { type: String, required: true, unique: true },
    name:       { type: String, required: true, unique: true, trim: true },
    image:      { type: String, default: '' },
    status:     { type: String, enum: ['active', 'inactive'], default: 'active' },
    isDeleted:  { type: Boolean, default: false },
    sortOrder:  { type: Number, default: 0 },
  },
  { timestamps: true }
);

categorySchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
categorySchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
categorySchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

categorySchema.index({ name: 'text' });
categorySchema.index({ status: 1, isDeleted: 1 });

export const Category = model<ICategory>('Category', categorySchema);
