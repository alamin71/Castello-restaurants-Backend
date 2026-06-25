import { Types } from 'mongoose';

export type TProductType = 'single' | 'variant';
export type TStatus = 'active' | 'inactive';

export interface IProductAvailability {
  website: boolean;
  pos: boolean;
  kiosk: boolean;
}

export interface IProduct {
  productId: string;
  name: string;
  description: string;
  categoryId: Types.ObjectId;
  type: TProductType;
  price?: number;
  mainImage: string;
  gallery: string[];
  toppingCategoryIds: Types.ObjectId[];
  defaultToppingItemIds: Types.ObjectId[];
  availability: IProductAvailability;
  status: TStatus;
  isDeleted: boolean;
}

export interface IProductVariant {
  productId: Types.ObjectId;
  variantCategoryId: Types.ObjectId;
  variantItemId: Types.ObjectId;
  price: number;
  status: TStatus;
}

export interface IVariantInput {
  variantCategoryId: string;
  variantItemId: string;
  price: number;
  status?: 'active' | 'inactive';
}
