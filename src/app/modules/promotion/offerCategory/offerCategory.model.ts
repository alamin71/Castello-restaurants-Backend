import { model, Schema } from 'mongoose';
import { IOfferCategory } from './offerCategory.interface';

const offerCategorySchema = new Schema<IOfferCategory>(
  {
    offerCategoryId: { type: String, required: true, unique: true },
    name:            { type: String, required: true, unique: true, trim: true },
    image:           { type: String, default: '' },
    status:          { type: String, enum: ['active', 'inactive'], default: 'active' },
    isDeleted:       { type: Boolean, default: false },
    sortOrder:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

offerCategorySchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
offerCategorySchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
offerCategorySchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

offerCategorySchema.index({ name: 'text' });

export const OfferCategory = model<IOfferCategory>('OfferCategory', offerCategorySchema);
