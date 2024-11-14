import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/database.service';
import { CreateManyEventsModel } from '../../../model/product/event/create-many-events.model';

@Injectable()
export class CreateManyEventsService {
  constructor(private readonly database: PrismaService) {}

  async execute(payload: CreateManyEventsModel) {
    const previousDeposit = await this.database.deposit.findFirst({
      where: {
        id: payload.previousDepositId,
      },
    });

    if (!previousDeposit) {
      throw new Error('Previous deposit not found');
    }

    const deposit = await this.database.deposit.findFirst({
      where: {
        id: payload.actualDepositId,
      },
    });

    if (!deposit) {
      throw new Error('Deposit not found');
    }

    payload.tagList.forEach(async (tag) => {
      const tagId = tag.split('-')[0];
      const productId = tag.split('-')[1];

      console.log('productId', productId);
      console.log('tagId', tagId);

      const event = await this.database.event.findMany({
        where: {
          productInstance: {
            productId,
          },
        },
      });

      const productInstance = await this.database.productInstance.findFirst({
        where: {
          productId,
          id: Number(tagId),
        },
      });

      if (!productInstance) {
        throw new Error('Product instance not found');
      }

      const eventCount = event.length;

      await this.database.event.create({
        data: {
          id: `${eventCount + 1}`,
          type: deposit.type,
          depositId: deposit.id,
          productInstanceId: productInstance.id,
        },
      });
    });
  }
}
