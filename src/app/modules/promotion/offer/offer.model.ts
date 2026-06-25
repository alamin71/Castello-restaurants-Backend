import { model, Schema } from 'mongoose';
import { IOffer } from './offer.interface';

const offerProductSlotSchema = new Schema(
  {
    productId:      { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variantItemIds: [{ type: Schema.Types.ObjectId, ref: 'VariantItem' }],
  },
  { _id: false }
);

const offerItemSchema = new Schema(
  {
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    isFixed:    { type: Boolean, default: false },
    products:   [offerProductSlotSchema],
  },
  { _id: false }
);

const offerSchema = new Schema<IOffer>(
  {
    offerId:     { type: String, required: true, unique: true },
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price:       { type: Number, required: true, min: 0 },
    mainImage:   { type: String, default: '' },
    gallery:     [{ type: String }],
    offerItems:  [offerItemSchema],
    totalItems:  { type: Number, default: 0 },
    availability: {
      website: { type: Boolean, default: true },
      pos:     { type: Boolean, default: true },
      kiosk:   { type: Boolean, default: false },
    },
    availableFor: {
      homeDelivery: { type: Boolean, default: true },
      takeaway:     { type: Boolean, default: true },
    },
    status:    { type: String, enum: ['active', 'inactive'], default: 'active' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

offerSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
offerSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
offerSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

offerSchema.index({ title: 'text' });
offerSchema.index({ status: 1, isDeleted: 1 });

export const Offer = model<IOffer>('Offer', offerSchema);
