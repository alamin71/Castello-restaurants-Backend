export type TStatus = 'active' | 'inactive';

export interface IOfferCategory {
  offerCategoryId: string;
  name: string;
  image: string;
  status: TStatus;
  isDeleted: boolean;
  sortOrder: number;
}
