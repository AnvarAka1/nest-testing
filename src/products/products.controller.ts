import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductEntity } from './product.entity';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  list(): Promise<ProductEntity[]> {
    try {
      return this.productsService.list();
    } catch (e) {}
  }

  @Get(':id')
  detail(@Param('id') id: number): Promise<ProductEntity> {
    try {
      return this.productsService.detail(id);
    } catch (e) {}
  }

  @Post()
  create(@Body() product): Promise<ProductEntity> {
    try {
      return this.productsService.create(product);
    } catch (e) {}
  }

  @Get(':id')
  update(@Param('id') id: number, @Body() product): Promise<ProductEntity> {
    try {
      return this.productsService.update(id, product);
    } catch (e) {}
  }
}
