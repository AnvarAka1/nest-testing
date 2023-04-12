export type Image = {
  id?: number;
  path: string;
  isDefault: boolean;
};

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
