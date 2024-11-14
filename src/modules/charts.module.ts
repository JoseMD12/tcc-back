import { Module } from '@nestjs/common';
import { PrismaModule } from './database.module';
import { ProductByDepositController } from '../common/controllers/charts/product-by-deposit.controller';
import { ProductByDepositService } from '../common/providers/charts/product-by-deposit.service';
import { MovingInstancesController } from '../common/controllers/charts/moving-instances.controller';
import { MovingInstancesService } from '../common/providers/charts/moving-instances.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProductByDepositController, MovingInstancesController],
  providers: [ProductByDepositService, MovingInstancesService],
  exports: [],
})
export class ChartsModule {}
