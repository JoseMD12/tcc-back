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
import { DeleteAllProductInstanceController } from '../common/controllers/product/product-instance/delete-all-product-instance.controller';
import { DeleteAllProductInstanceService } from '../common/providers/product/product-instance/delete-all-product-instance.service';
import { CreateManyProductInstanceController } from '../common/controllers/product/product-instance/create-many-product-instance.controller';
import { CreateManyProductInstanceService } from '../common/providers/product/product-instance/create-many-product-instance.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    CreateProductInstanceController,
    CreateManyProductInstanceController,
    ListProductInstanceController,
    ExportProductInstanceController,
    FindProductInstanceByIdController,
    DeleteAllProductInstanceController,
  ],
  providers: [
    CreateProductInstanceService,
    CreateManyProductInstanceService,
    ListProductInstanceService,
    ExportProductInstanceService,
    FindProductInstanceByIdService,
    DeleteAllProductInstanceService,
  ],
  exports: [],
})
export class ProductInstanceModule {}
