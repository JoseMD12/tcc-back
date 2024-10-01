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
          has: payload.storageZone,
        },
      },
    });

    if (!deposit) {
      throw new Error('Deposit not found');
    }

    const event = await this.database.event.findMany({
      where: {
        productInstance: {
          productId: payload.productId,
        },
      },
    });

    const productInstance = await this.database.productInstance.findFirst({
      where: {
        productId: payload.productId,
        AND: {
          events: {},
        },
      },
    });
  }
}
