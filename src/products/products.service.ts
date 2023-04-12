import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product';
import { Repository } from 'typeorm';
import { User } from '../users/user';
import { ProductCreateDto, ProductUpdateDto } from './dto';
import { ProductImage } from './entities/productImage';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(ProductImage)
    private readonly imageRepository: Repository<ProductImage>,
  ) {}

  async create(product: ProductCreateDto): Promise<Product> {
    const productEntity = new Product();

    const images = [];
    for (const image of product.images) {
      const productImageEntity = new ProductImage();
      productImageEntity.path = image.path;

      images.push(productImageEntity);

      await this.imageRepository.save(productImageEntity);
    }

    productEntity.title = product.title;
    productEntity.description = product.description;
    productEntity.quantity = product.quantity;
    productEntity.price = product.price;

    productEntity.images = images;

    return await this.productsRepository.save(productEntity);
  }

  async update(productId: number, product: ProductUpdateDto): Promise<Product> {
    const productEntity = await this.productsRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id: productId })
      .getOneOrFail();

    const { imagesToSave } = await this._updateImages(
      productId,
      product.images,
    );

    productEntity.title = product.title;
    productEntity.description = product.description;
    productEntity.quantity = product.quantity;
    productEntity.price = product.price;
    productEntity.images = imagesToSave;

    return await this.productsRepository.save(productEntity);
  }

  async list(): Promise<Product[]> {
    return await this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.user', 'user')
      .getMany();
  }

  async detail(productId: number): Promise<Product> {
    return await this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.user', 'user')
      .where('product.id = :productId', { productId })
      .getOneOrFail();
  }

  async _updateImages(productId: number, images: ProductImage[]) {
    const existingImages = images.filter(({ id }) => id);
    const existingImageIds = existingImages.map(({ id }) => id);

    const newImages = images.filter(({ id }) => !id);

    const existingImageEntity = await this.imageRepository
      .createQueryBuilder('image')
      .leftJoinAndSelect('image.product', 'product')
      .where('product.id = :productId', { productId })
      .andWhere('image.id IN (:imageIds)', { imageIds: existingImageIds })
      .getMany();

    await this.imageRepository
      .createQueryBuilder('image')
      .leftJoinAndSelect(`image.product`, 'product')
      .update(ProductImage)
      .set({ isDeleted: true })
      .where('product.id = :productId', { productId })
      .andWhere('image.id NOT IN (:imageIds)', { imageIds: existingImageIds })
      .execute();

    for (const newImage of newImages) {
      const imageEntity = new ProductImage();
      imageEntity.path = newImage.path;
      imageEntity.isDefault = newImage.isDefault;
      existingImageEntity.push(imageEntity);

      await this.imageRepository.save(newImage);
    }

    return { imagesToSave: existingImageEntity };
  }
}
