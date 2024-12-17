import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';
import { DateTime } from 'luxon';

@Injectable()
export class TotalOrdersService {
  constructor(private readonly database: PrismaService) {}

  async getTotalOrders() {
    const orders = await this.database.order.findMany();

    const tomorrow = DateTime.now().plus({ days: 1 }).startOf('day');

    const tomorrowOrders = orders.filter((order) => {
      {
        const orderDate = DateTime.fromJSDate(order.orderDate).startOf('day');
        return tomorrow.hasSame(orderDate, 'day');
      }
    });

    return {
      total: orders.length,
      tomorrow: tomorrowOrders.length,
    };
  }
}
