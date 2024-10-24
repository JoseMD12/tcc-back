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

    await this.database.productInstance.create({
      include: {
        events: true,
      },
      data: {
        id: payload.id,
        quantity: payload.quantity,
        productId: payload.productId,
        events: {
          create: {
            id: '1',
            type: 'REGISTRATION',
            depositId: deposit.id,
          },
        },
      },
    });
  }
}
