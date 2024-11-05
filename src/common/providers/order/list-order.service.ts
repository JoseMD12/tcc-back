import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';

@Injectable()
export class ListOrderService {
  constructor(private readonly database: PrismaService) {}

  async execute() {
    return this.database.order.findMany({
      select: {
        id: true,
        orderDate: true,
        products: true,
      },
    });
  }
}
