export type TDiscountMethod = 'percent' | 'amount';
export type TStatus = 'active' | 'inactive';

export interface IApplicableProduct {
  productId: string;
  variantItemIds: string[];
}

export interface IDiscount {
  discountId: string;
  name: string;
  discountMethod: TDiscountMethod;
  discountValue: number;
  startDate: Date;
  expireDate: Date;
  isApplicableForAll: boolean;
  applicableProducts: IApplicableProduct[];
  status: TStatus;
  isDeleted: boolean;
}
