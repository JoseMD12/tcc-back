import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/database.service';
import { CreateProductInstanceModel } from '../../../model/product/product-instance/create-product-instance.model';

@Injectable()
export class CreateProductInstanceService {
  constructor(private readonly database: PrismaService) {}

  async execute(payload: CreateProductInstanceModel) {
    const product = await this.database.product.findUnique({
      where: { id: payload.productId },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const deposit = await this.database.deposit.findFirst({
      where: {
        id: payload.depositId,
      },
    });

    if (!deposit) {
      throw new Error('Deposit not found');
    }

    let eventDate = new Date();

    if (payload.eventDate) {
      const [day, month, year] = payload.eventDate?.split('/');
      eventDate = new Date(`${year}-${month}-${day}`);
    }

    await this.database.productInstance.create({
      include: {
        events: true,
      },
      data: {
        quantity: payload.quantity,
        productId: payload.productId,
        FIFO: eventDate,
        events: {
          create: {
            type: deposit.type,
            depositId: deposit.id,
            eventDate,
          },
        },
      },
    });
  }
}
