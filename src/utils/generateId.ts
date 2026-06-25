const randomDigits = (count: number): string => {
  const min = Math.pow(10, count - 1);
  const max = Math.pow(10, count) - 1;
  return String(Math.floor(min + Math.random() * (max - min + 1)));
};

export const generateCategoryId = (): string => `C-${randomDigits(6)}`;
export const generateProductId = (): string => `CP-${randomDigits(5)}`;
export const generateVariantCategoryId = (): string => `VC-${randomDigits(5)}`;
export const generateVariantItemId = (): string => `VI-${randomDigits(5)}`;
export const generateToppingCategoryId = (): string => `TC-${randomDigits(5)}`;
export const generateToppingItemId = (): string => `TI-${randomDigits(5)}`;
export const generateOfferId = (): string => `OF-${randomDigits(5)}`;
