import { Module } from '@nestjs/common';
import { PrismaModule } from './database.module';
import { CreateProductInstanceController } from '../common/controllers/product/productInstance/create-product-instance.controller';
import { CreateProductInstanceService } from '../common/providers/product/productInstance/create-product-instance.service';
import { ListProductInstanceController } from '../common/controllers/product/productInstance/list-product-instance.controller';
import { ListProductInstanceService } from '../common/providers/product/productInstance/list-product-instance.service';

@Module({
  imports: [PrismaModule],
  controllers: [CreateProductInstanceController, ListProductInstanceController],
  providers: [CreateProductInstanceService, ListProductInstanceService],
  exports: [],
})
export class ProductInstanceModule {}
