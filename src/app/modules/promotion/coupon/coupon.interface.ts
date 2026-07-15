export type TDiscountMethod = 'percent' | 'amount';
export type TStatus = 'active' | 'inactive';

export interface IApplicableProduct {
  productId: string;
  variantItemIds: string[];
}

export interface ICoupon {
  couponId: string;
  name: string;
  code: string;
  discountMethod: TDiscountMethod;
  discountValue: number;
  minimumOrder: number;
  startDate: Date;
  expireDate: Date;
  isApplicableForAll: boolean;
  applicableProducts: IApplicableProduct[];
  status: TStatus;
  isDeleted: boolean;
}
