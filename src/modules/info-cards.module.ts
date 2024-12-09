import { Module } from '@nestjs/common';
import { PrismaModule } from './database.module';
import { TotalInventoryController } from '../common/controllers/info-cards/total-inventory.controller';
import { TotalInventoryService } from '../common/providers/info-cards/total-inventory.service';
import { TotalOrdersController } from '../common/controllers/info-cards/total-orders.controller';
import { TotalOrdersService } from '../common/providers/info-cards/total-orders.service';

@Module({
  imports: [PrismaModule],
  controllers: [TotalInventoryController, TotalOrdersController],
  providers: [TotalInventoryService, TotalOrdersService],
  exports: [],
})
export class InfoCardsModule {}
