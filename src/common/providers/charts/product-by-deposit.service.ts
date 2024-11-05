import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';

@Injectable()
export class ProductByDepositService {
  constructor(private readonly database: PrismaService) {}
  async execute(
    productId?: string,
  ): Promise<{ name: string; totalAmount: number }[]> {
    let productInstances = await this.database.productInstance.findMany({
      include: {
        product: true,
        events: true,
      },
    });

    if (productId) {
      productInstances = productInstances.filter(
        (productInstance) => productInstance.productId === productId,
      );
    }

    const deposits = await this.database.deposit.findMany();
    const productQuantityByDeposit: {
      [key: string]: { name: string; totalAmount: number };
    } = {};

    deposits.forEach((deposit) => {
      productQuantityByDeposit[deposit.id] = {
        name: deposit.name,
        totalAmount: 0,
      };
    });

    productInstances
      .filter((productInstance) => {
        const productHasFinishedLifeTime = productInstance.events
          .map((event) => event.type)
          .includes('DESTINATION');

        return !productHasFinishedLifeTime;
      })
      .forEach((productInstance) => {
        const depositId = productInstance.events.sort((a, b) => {
          return (
            new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
          );
        })[0].depositId;
        productQuantityByDeposit[depositId].totalAmount +=
          productInstance.quantity;
      });

    return Object.values(productQuantityByDeposit);
  }
}
