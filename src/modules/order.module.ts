import { Module } from '@nestjs/common';
import { PrismaModule } from './database.module';
import { CreateOrderController } from '../common/controllers/order/create-order.controller';
import { CreateOrderService } from '../common/providers/order/create-order.service';
import { ListOrderController } from '../common/controllers/order/list-order.controller';
import { ListOrderService } from '../common/providers/order/list-order.service';
import { DeleteManyOrdersController } from '../common/controllers/order/delete-many-orders.controller';
import { DeleteManyOrdersService } from '../common/providers/order/delete-many-orders.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    CreateOrderController,
    ListOrderController,
    DeleteManyOrdersController,
  ],
  providers: [CreateOrderService, ListOrderService, DeleteManyOrdersService],
  exports: [],
})
export class OrderModule {}
