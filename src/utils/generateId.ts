import { getNextSequence } from './counter';

export const generateCategoryId = async (): Promise<string> =>
  `C-${await getNextSequence('category')}`;

export const generateProductId = async (): Promise<string> =>
  `CP-${await getNextSequence('product')}`;

export const generateVariantCategoryId = async (): Promise<string> =>
  `VC-${await getNextSequence('variantCategory')}`;

export const generateVariantItemId = async (): Promise<string> =>
  `VI-${await getNextSequence('variantItem')}`;

export const generateToppingCategoryId = async (): Promise<string> =>
  `TC-${await getNextSequence('toppingCategory')}`;

export const generateToppingItemId = async (): Promise<string> =>
  `TI-${await getNextSequence('toppingItem')}`;

export const generateOfferId = async (): Promise<string> =>
  `OF-${await getNextSequence('offer')}`;

export const generateCouponId = async (): Promise<string> =>
  `CPN-${await getNextSequence('coupon')}`;

export const generateDiscountId = async (): Promise<string> =>
  `DIS-${await getNextSequence('discount')}`;

export const generateOfferCategoryId = async (): Promise<string> =>
  `OC-${await getNextSequence('offerCategory')}`;
