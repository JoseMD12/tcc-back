import { Module } from '@nestjs/common';
import { PrismaModule } from './database.module';
import { CreateManyDepositsController } from '../common/controllers/deposit/create-many-deposits.controller';
import { DeleteManyDepositsController } from '../common/controllers/deposit/delete-many-deposits.controller';
import { ListDepositsController } from '../common/controllers/deposit/list-deposits.controller';
import { CreateManyDepositsService } from '../common/providers/deposit/create-many-deposits.service';
import { DeleteManyDepositsService } from '../common/providers/deposit/delete-many-deposits.service';
import { ListDepositsService } from '../common/providers/deposit/list-deposits.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    CreateManyDepositsController,
    DeleteManyDepositsController,
    ListDepositsController,
  ],
  providers: [
    CreateManyDepositsService,
    DeleteManyDepositsService,
    ListDepositsService,
  ],
  exports: [],
})
export class DepositModule {}
