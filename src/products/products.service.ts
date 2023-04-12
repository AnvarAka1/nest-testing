import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { Image, ProductCreateDto, ProductUpdateDto } from './dto';
import { ImageEntity } from '../images/image.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
  ) {}

  async create(product: ProductCreateDto): Promise<ProductEntity> {
    const productEntity = new ProductEntity();

    const images = [];
    for (const image of product.images) {
      const imageEntity = new ImageEntity();
      imageEntity.path = image.path;

      images.push(imageEntity);

      await this.imageRepository.save(imageEntity);
    }

    productEntity.title = product.title;
    productEntity.description = product.description;
    productEntity.quantity = product.quantity;
    productEntity.price = product.price;

    productEntity.images = images;

    return await this.productsRepository.save(productEntity);
  }

  async update(
    productId: number,
    product: ProductUpdateDto,
  ): Promise<ProductEntity> {
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

  async list(): Promise<ProductEntity[]> {
    return await this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.user', 'user')
      .getMany();
  }

  async detail(productId: number): Promise<ProductEntity> {
    return await this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.user', 'user')
      .where('product.id = :productId', { productId })
      .getOneOrFail();
  }

  async _updateImages(productId: number, images: Image[]) {
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
      .update(ImageEntity)
      .set({ isDeleted: true })
      .where('product.id = :productId', { productId })
      .andWhere('image.id NOT IN (:imageIds)', { imageIds: existingImageIds })
      .execute();

    for (const newImage of newImages) {
      const imageEntity = new ImageEntity();
      imageEntity.path = newImage.path;
      imageEntity.isDefault = newImage.isDefault;
      existingImageEntity.push(imageEntity);

      await this.imageRepository.save(newImage);
    }

    return { imagesToSave: existingImageEntity };
  }
}
