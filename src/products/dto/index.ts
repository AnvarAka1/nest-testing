import { ProductImage } from '../entities/productImage';

export type ProductCreateDto = {
  title: string;
  description: string;
  price: number;
  quantity: number;
  images: ProductImage[];
};

export type ProductUpdateDto = {
  title: string;
  description: string;
  price: number;
  quantity: number;
  images: ProductImage[];
};
