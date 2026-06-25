export type TStatus = 'active' | 'inactive';

export interface ICategory {
  categoryId: string;
  name: string;
  image: string;
  status: TStatus;
  isDeleted: boolean;
}
