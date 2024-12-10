import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/database.service';
import { CreateManyEventsModel } from '../../../model/product/event/create-many-events.model';
import { EventsGateway } from './event.gateway';

@Injectable()
export class CreateManyEventsService {
  constructor(
    private readonly database: PrismaService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async execute(payload: CreateManyEventsModel) {
    // const previousDeposit = await this.database.deposit.findFirst({
    //   where: {
    //     id: payload.previousDepositId,
    //   },
    // });

    // if (!previousDeposit) {
    //   throw new Error('Previous deposit not found');
    // }

    console.log('payload', payload);

    // this.eventsGateway.sendEventUpdate('0');

    // return;

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

      const event = await this.database.event.findMany({
        where: {
          productInstance: {
            productId,
          },
        },
      });

      if (event.length === 0) return;

      const eventAlreadyExists =
        event.sort((a, b) => {
          return (
            new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
          );
        })[0].depositId === deposit.id;

      console.log('eventAlreadyExists', eventAlreadyExists);

      if (eventAlreadyExists) return;

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
          type: deposit.type,
          depositId: deposit.id,
          productInstanceId: productInstance.id,
        },
      });
    });

    this.eventsGateway.sendEventUpdate('0');
  }
}
