import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  list(): Promise<Product[]> {
    try {
      return this.productsService.list();
    } catch (e) {}
  }

  @Get(':id')
  detail(@Param('id') id: number): Promise<Product> {
    try {
      return this.productsService.detail(id);
    } catch (e) {}
  }

  @Post()
  create(@Body() product): Promise<Product> {
    try {
      return this.productsService.create(product);
    } catch (e) {}
  }

  @Get(':id')
  update(@Param('id') id: number, @Body() product): Promise<Product> {
    try {
      return this.productsService.update(id, product);
    } catch (e) {}
  }
}
