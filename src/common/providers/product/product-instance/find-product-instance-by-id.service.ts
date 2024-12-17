import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/database.service';

@Injectable()
export class FindProductInstanceByIdService {
  constructor(private readonly database: PrismaService) {}

  async execute(tagId: string) {
    const productInstance = await this.database.productInstance.findUnique({
      where: {
        id: Number(tagId),
      },
      include: {
        product: true,
        events: true,
      },
    });

    if (!productInstance) {
      return null;
    }

    const lastEvent = productInstance.events.sort((a, b) => {
      return b.eventDate.getTime() - a.eventDate.getTime();
    })[0];

    const deposit = await this.database.deposit.findUnique({
      where: {
        id: lastEvent.depositId,
      },
    });

    const response = {
      deposit: deposit.name,
      productId: productInstance.productId,
      productDescription: productInstance.product.description,
      quantity: productInstance.quantity,
    };

    return response;
  }
}
