import { model, Schema } from 'mongoose';
import { ICoupon } from './coupon.interface';

const applicableProductSchema = new Schema(
  {
    productId:      { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variantItemIds: [{ type: Schema.Types.ObjectId, ref: 'VariantItem' }],
  },
  { _id: false }
);

const couponSchema = new Schema<ICoupon>(
  {
    couponId:           { type: String, required: true, unique: true },
    name:               { type: String, required: true, trim: true },
    code:               { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountMethod:     { type: String, enum: ['percent', 'amount'], required: true },
    discountValue:      { type: Number, required: true, min: 0 },
    minimumOrder:       { type: Number, required: true, min: 0 },
    startDate:          { type: Date, required: true },
    expireDate:         { type: Date, required: true },
    isApplicableForAll: { type: Boolean, default: true },
    applicableProducts: { type: [applicableProductSchema], default: [] },
    status:             { type: String, enum: ['active', 'inactive'], default: 'active' },
    isDeleted:          { type: Boolean, default: false },
  },
  { timestamps: true }
);

couponSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
couponSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

couponSchema.index({ code: 1 });
couponSchema.index({ status: 1 });
couponSchema.index({ expireDate: 1 });

export const Coupon = model<ICoupon>('Coupon', couponSchema);
