import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';

@Injectable()
export class DepositOccupationService {
  constructor(private readonly database: PrismaService) {}

  async execute(depositId?: string) {
    const deposit = await this.database.deposit.findFirst({
      where: { id: depositId },
    });

    if (depositId && !deposit) {
      throw new Error('Depósito não encontrado');
    }

    const productInstances = await this.database.productInstance.findMany({
      include: {
        product: true,
        events: true,
      },
    });

    let totalAmount = 0;

    productInstances
      .filter((productInstance) => {
        return productInstance.events.length > 0;
      })
      .forEach((productInstance) => {
        const sortedEvents = productInstance.events.sort((a, b) => {
          return (
            new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
          );
        });

        const lastEvent = sortedEvents[0];

        if (lastEvent.depositId === depositId) {
          totalAmount += productInstance.quantity;
        }
      });

    const response = {
      name: deposit.name,
      percentOfUsage: (totalAmount / deposit.maxQuantity) * 100,
      percentOfFreeSpace: 100 - (totalAmount / deposit.maxQuantity) * 100,
    };

    return response;
  }
}
