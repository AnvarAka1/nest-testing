import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { Product } from '../products/entities/product';
import { User } from './user';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  list(): Promise<User[]> {
    try {
      return this.usersService.list();
    } catch (e) {}
  }

  @Get(':id')
  detail(@Param('id') id: number): Promise<User> {
    try {
      return this.usersService.detail(id);
    } catch (e) {}
  }

  @Post()
  create(@Body() user): Promise<User> {
    try {
      return this.usersService.create(user);
    } catch (e) {}
  }

  @Get(':id')
  update(@Param('id') id: number, @Body() user): Promise<User> {
    try {
      return this.usersService.update(id, user);
    } catch (e) {}
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    try {
      return this.usersService.remove(id);
    } catch (e) {}
  }
}
