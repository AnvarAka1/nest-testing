import { UserDetailDto } from '../../dto';

export type Image = {
  id?: number;
  path: string;
  isDefault: boolean;
};

export type ProductDetailDto = {
  id: number;
  title: string;
  description: string;
  price: number;
  quantity: number;
  images: Image[];
  users: UserDetailDto[] & { products: null }[];
  createdAt: string;
  updatedAt: string;
};

export type ProductListDto = ProductDetailDto[];

export type ProductCreateDto = {
  title: string;
  description: string;
  price: number;
  quantity: number;
  images: Image[];
};

export type ProductUpdateDto = {
  title: string;
  description: string;
  price: number;
  quantity: number;
  images: Image[];
};
