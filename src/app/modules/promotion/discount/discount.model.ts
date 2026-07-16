import { model, Schema } from 'mongoose';
import { IDiscount } from './discount.interface';

const applicableProductSchema = new Schema(
  {
    productId:      { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variantItemIds: [{ type: Schema.Types.ObjectId, ref: 'VariantItem' }],
  },
  { _id: false }
);

const discountSchema = new Schema<IDiscount>(
  {
    discountId:         { type: String, required: true, unique: true },
    name:               { type: String, required: true, trim: true },
    discountMethod:     { type: String, enum: ['percent', 'amount'], required: true },
    discountValue:      { type: Number, required: true, min: 0 },
    startDate:          { type: Date, required: true },
    expireDate:         { type: Date, required: true },
    isApplicableForAll: { type: Boolean, default: true },
    applicableProducts: { type: [applicableProductSchema], default: [] },
    status:             { type: String, enum: ['active', 'inactive'], default: 'active' },
    isDeleted:          { type: Boolean, default: false },
  },
  { timestamps: true }
);

discountSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
discountSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

discountSchema.index({ status: 1 });
discountSchema.index({ expireDate: 1 });

export const Discount = model<IDiscount>('Discount', discountSchema);
