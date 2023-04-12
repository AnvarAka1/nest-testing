import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './libs/typeorm/config';
import { UsersHttpModule } from './users-http/users-http.module';
import { ProductsModule } from './products/products.module';
import { ImagesController } from './images/images.controller';
import { ImagesService } from './images/images.service';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    UsersModule,
    UsersHttpModule,
    ProductsModule,
    ImagesModule,
  ],
  controllers: [AppController, ImagesController],
  providers: [AppService, ImagesService],
})
export class AppModule {}
