import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/database.service';
import { CreateEventModel } from '../../../model/product/event/create-event.model';

@Injectable()
export class CreateEventService {
  constructor(private readonly database: PrismaService) {}

  async createEvent(payload: CreateEventModel) {
    const previousDeposit = await this.database.deposit.findFirst({
      where: {
        storageZones: {
          has: payload.previousStorageZone,
        },
      },
    });

    if (!previousDeposit) {
      throw new Error('Previous deposit not found');
    }

    const deposit = await this.database.deposit.findFirst({
      where: {
        storageZones: {
          has: payload.actualStorageZone,
        },
      },
    });

    if (!deposit) {
      throw new Error('Deposit not found');
    }

    const productId = payload.tagId.split('-')[0];
    const tagId = payload.tagId.split('-')[1];

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
        id: tagId,
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
  }
}
