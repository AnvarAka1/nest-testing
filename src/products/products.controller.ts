import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductEntity } from './product.entity';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Get()
  getList(): Promise<ProductEntity[]> {
    try {
      return this.productService.list();
    } catch (e) {}
  }

  @Get(':id')
  getDetail(@Param('id') id: number): Promise<ProductEntity> {
    try {
      return this.productService.detail(id);
    } catch (e) {}
  }

  @Post()
  create(@Body() product): Promise<ProductEntity> {
    try {
      return this.productService.create(product);
    } catch (e) {}
  }

  @Get()
  update(@Param('id') id: number, @Body() product): Promise<ProductEntity> {
    try {
      return this.productService.update(id, product);
    } catch (e) {}
  }
}
