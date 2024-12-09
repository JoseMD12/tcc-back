import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/database.service';
import { OrderModel } from '../../model/order/order.model';
import * as luxon from 'luxon';

@Injectable()
export class CreateOrderService {
  constructor(private readonly database: PrismaService) {}

  async execute(data: OrderModel) {
    const products = await this.database.product.findMany({
      where: {
        description: {
          in: data.products.map((product) => product.productId),
        },
      },
    });

    if (products.length !== data.products.length) {
      throw new Error('Algum produto não foi encontrado');
    }

    const orderDate = luxon.DateTime.fromFormat(
      data.orderDate,
      'yyyy-MM-dd',
    ).toJSDate();

    const order = await this.database.order.create({
      data: {
        orderDate,
        products: {
          createMany: {
            data: data.products.map((product) => ({
              quantity: product.quantity,
              productId: products.find(
                (p) => p.description === product.productId,
              ).id,
            })),
          },
        },
      },
      select: {
        products: true,
      },
    });

    return order;
  }
}
