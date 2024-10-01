import { Module } from '@nestjs/common';
import { CreateManyProductsService } from '../common/providers/product/create-many-products.service';
import { CreateManyProductsController } from '../common/controllers/product/create-many-products.controller';
import { PrismaModule } from './database.module';
import { DeleteManyProductsController } from '../common/controllers/product/delete-many-products.controller';
import { ListProductsController } from '../common/controllers/product/list-products.controller';
import { DeleteManyProductsService } from '../common/providers/product/delete-many-products.service';
import { ListProductsService } from '../common/providers/product/list-products.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    CreateManyProductsController,
    DeleteManyProductsController,
    ListProductsController,
  ],
  providers: [
    CreateManyProductsService,
    DeleteManyProductsService,
    ListProductsService,
  ],
  exports: [],
})
export class ProductModule {}
