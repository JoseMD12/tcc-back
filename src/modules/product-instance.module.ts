import { Module } from '@nestjs/common';
import { PrismaModule } from './database.module';
import { CreateProductInstanceController } from '../common/controllers/product/product-instance/create-product-instance.controller';
import { ListProductInstanceController } from '../common/controllers/product/product-instance/list-product-instance.controller';
import { ListProductInstanceService } from '../common/providers/product/product-instance/list-product-instance.service';
import { CreateProductInstanceService } from '../common/providers/product/product-instance/create-product-instance.service';
import { ExportProductInstanceController } from '../common/controllers/product/product-instance/export-product-instance.controller';
import { ExportProductInstanceService } from '../common/providers/product/product-instance/export-product-instance.service';
import { FindProductInstanceByIdController } from '../common/controllers/product/product-instance/find-product-instance-by-id.controller';
import { FindProductInstanceByIdService } from '../common/providers/product/product-instance/find-product-instance-by-id.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    CreateProductInstanceController,
    ListProductInstanceController,
    ExportProductInstanceController,
    FindProductInstanceByIdController,
  ],
  providers: [
    CreateProductInstanceService,
    ListProductInstanceService,
    ExportProductInstanceService,
    FindProductInstanceByIdService,
  ],
  exports: [],
})
export class ProductInstanceModule {}
