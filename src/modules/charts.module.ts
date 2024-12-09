import { Module } from '@nestjs/common';
import { PrismaModule } from './database.module';
import { ProductByDepositController } from '../common/controllers/charts/product-by-deposit.controller';
import { ProductByDepositService } from '../common/providers/charts/product-by-deposit.service';
import { MovingInstancesController } from '../common/controllers/charts/moving-instances.controller';
import { MovingInstancesService } from '../common/providers/charts/moving-instances.service';
import { DepositOccupationController } from '../common/controllers/charts/deposit-occupation.controller';
import { DepositOccupationService } from '../common/providers/charts/deposit-occupation.service';
import { StockProjectionService } from '../common/providers/charts/stock-projection.service';
import { StockProjectionController } from '../common/controllers/charts/stock-projection.controller';
import { ExportStockProjectionController } from '../common/controllers/charts/export-stock-projection.controller';
import { ExportStockProjectionService } from '../common/providers/charts/export-stock-projection.service';
import { ExportProductByDepositController } from '../common/controllers/charts/export-product-by-deposit.controller';
import { ExportProductByDepositService } from '../common/providers/charts/export-product-by-deposit.service';
import { UtilsModule } from './utils.module';
import { ExportMovingInstancesController } from '../common/controllers/charts/export-moving-instances.controller';
import { ExportMovingInstancesService } from '../common/providers/charts/export-moving-instances.service';

@Module({
  imports: [PrismaModule, UtilsModule],
  controllers: [
    ProductByDepositController,
    ExportProductByDepositController,
    MovingInstancesController,
    ExportMovingInstancesController,
    DepositOccupationController,
    ExportStockProjectionController,
    StockProjectionController,
  ],
  providers: [
    ProductByDepositService,
    ExportProductByDepositService,
    MovingInstancesService,
    ExportMovingInstancesService,
    DepositOccupationService,
    ExportStockProjectionService,
    StockProjectionService,
  ],
  exports: [],
})
export class ChartsModule {}
