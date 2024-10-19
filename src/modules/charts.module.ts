import { Module } from '@nestjs/common';
import { PrismaModule } from './database.module';
import { ProductByDepositController } from '../common/controllers/charts/product-by-deposit.controller';
import { ProductByDepositService } from '../common/providers/charts/product-by-deposit.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProductByDepositController],
  providers: [ProductByDepositService],
  exports: [],
})
export class ChartsModule {}
