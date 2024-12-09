import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';
import * as luxon from 'luxon';

@Injectable()
export class TotalOrdersService {
  constructor(private readonly database: PrismaService) {}

  async getTotalOrders() {
    const orders = await this.database.order.findMany();

    const tomorrow = luxon.DateTime.now().plus({ days: 1 }).toJSDate();

    const tomorrowOrders = orders.filter(
      (order) => order.orderDate === tomorrow,
    );

    return {
      total: orders.length,
      tomorrow: tomorrowOrders.length,
    };
  }
}
