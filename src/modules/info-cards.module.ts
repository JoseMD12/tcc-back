import { Module } from '@nestjs/common';
import { PrismaModule } from './database.module';
import { TotalInventoryController } from '../common/controllers/info-cards/total-inventory.controller';
import { TotalInventoryService } from '../common/providers/info-cards/total-inventory.service';

@Module({
  imports: [PrismaModule],
  controllers: [TotalInventoryController],
  providers: [TotalInventoryService],
  exports: [],
})
export class InfoCardsModule {}
