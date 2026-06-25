import { Types } from 'mongoose';

export type TStatus = 'active' | 'inactive';

export interface IOfferProductSlot {
  productId: Types.ObjectId;
  variantItemIds: Types.ObjectId[];
}

export interface IOfferItem {
  categoryId: Types.ObjectId;
  isFixed: boolean;
  products: IOfferProductSlot[];
}

export interface IOfferAvailability {
  website: boolean;
  pos: boolean;
  kiosk: boolean;
}

export interface IOfferAvailableFor {
  homeDelivery: boolean;
  takeaway: boolean;
}

export interface IOffer {
  offerId: string;
  title: string;
  description: string;
  price: number;
  mainImage: string;
  gallery: string[];
  offerItems: IOfferItem[];
  totalItems: number;
  availability: IOfferAvailability;
  availableFor: IOfferAvailableFor;
  status: TStatus;
  isDeleted: boolean;
}
