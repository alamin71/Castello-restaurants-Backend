import { Types } from 'mongoose';

export type TStatus = 'active' | 'inactive';

export interface IToppingCategory {
  toppingCategoryId: string;
  name: string;
  status: TStatus;
  isDeleted: boolean;
}

export interface IToppingItem {
  toppingItemId: string;
  name: string;
  toppingCategoryId: Types.ObjectId;
  price: number;
  status: TStatus;
  isDeleted: boolean;
}
