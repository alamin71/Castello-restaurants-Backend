import { Types } from 'mongoose';

export type TStatus = 'active' | 'inactive';

export interface IVariantCategory {
  variantCategoryId: string;
  name: string;
  status: TStatus;
  isDeleted: boolean;
}

export interface IVariantItem {
  variantItemId: string;
  name: string;
  variantCategoryId: Types.ObjectId;
  status: TStatus;
  isDeleted: boolean;
}
