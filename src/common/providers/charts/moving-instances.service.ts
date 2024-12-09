import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';
import { MovimentationType } from '../../model/deposit/movimentation-type';
import { EventType } from '@prisma/client';
import { RemoveDuplicates } from '../../utils/remove-duplicates.service';

@Injectable()
export class MovingInstancesService {
  constructor(
    private readonly database: PrismaService,
    private readonly removeDuplicates: RemoveDuplicates,
  ) {}
  async execute(
    movingType: MovimentationType,
    depositId?: string,
    search?: string,
  ) {
    if (!movingType) {
      throw new Error('Tipo de Movimentação deve ser informado');
    } else if (!Object.values(MovimentationType).includes(movingType)) {
      throw new Error('Tipo de Movimentação inválido');
    }

    let productInstances = await this.database.productInstance.findMany({
      include: {
        product: true,
        events: true,
      },
    });

    if (search) {
      productInstances = productInstances.filter((productInstance) => {
        return (
          productInstance.product.description.includes(search) ||
          productInstance.product.id.includes(search)
        );
      });
    }

    if (!depositId) {
      productInstances = productInstances.map((productInstance) => {
        productInstance.events = this.removeDuplicates.events(
          productInstance.events,
        );
        return productInstance;
      });
    }

    const deposit = await this.database.deposit.findFirst({
      where: { id: depositId },
    });

    if (depositId && !deposit) {
      throw new Error('Depósito não encontrado');
    }

    const productQuantityByMonth: {
      [key: string]: {
        name: string;
        monthNumber: number;
        totalAmount: number;
        products: {
          deposit: string;
          productId: string;
          productDescription: string;
          quantity: number;
          tagId: string;
          eventDate: Date;
        }[];
      };
    } = {};

    for (let i = 0; i < 12; i++) {
      const month = i.toString().padStart(2, '0');
      const monthName = new Date(0, i).toLocaleString('pt-BR', {
        month: 'long',
      });

      let totalAmount = 0;
      let products = [];

      productInstances.forEach((productInstance) => {
        switch (movingType) {
          case MovimentationType.CHANGE:
            const validChangeEvents = productInstance.events.filter((event) => {
              return event.eventDate.getMonth() === i;
            });

            if (!validChangeEvents.length) {
              return;
            }

            const lastEvent = validChangeEvents.sort(
              (a, b) => b.eventDate.getTime() - a.eventDate.getTime(),
            )[0];

            if (
              lastEvent.type === EventType.DEPOSIT ||
              lastEvent.type === EventType.TRANSPORTATION
            ) {
              totalAmount += productInstance.quantity;
              products.push({
                deposit: lastEvent.depositId,
                productId: productInstance.productId,
                productDescription: productInstance.product.description,
                quantity: productInstance.quantity,
                tagId: `${productInstance.id}-${productInstance.productId}`,
                eventDate: lastEvent.eventDate,
                type: movingType,
              });
            }
            break;

          case MovimentationType.IN:
            const validInEvent = productInstance.events.filter((event) => {
              const isValidMonth = event.eventDate.getMonth() === i;
              const isRegistrationEvent = event.type === EventType.REGISTRATION;

              if (!depositId) {
                return isValidMonth && isRegistrationEvent;
              }

              const isFromDeposit = event.depositId === depositId;
              return isValidMonth && isFromDeposit;
            });

            if (validInEvent.length) {
              totalAmount += productInstance.quantity;
              products.push(
                ...validInEvent.map((event) => ({
                  deposit: event.depositId,
                  productId: productInstance.productId,
                  productDescription: productInstance.product.description,
                  quantity: productInstance.quantity,
                  tagId: `${productInstance.id}-${productInstance.productId}`,
                  eventDate: event.eventDate,
                  type: movingType,
                })),
              );
            }
            break;

          case MovimentationType.OUT:
            if (!depositId) {
              const validOutEvent = productInstance.events.filter((event) => {
                const isValidMonth = event.eventDate.getMonth() === i;
                const isDestinationEvent = event.type === EventType.DESTINATION;

                return isValidMonth && isDestinationEvent;
              });

              if (validOutEvent.length) {
                totalAmount += productInstance.quantity;
                products.push(
                  ...validOutEvent.map((event) => ({
                    deposit: event.depositId,
                    productId: productInstance.productId,
                    productDescription: productInstance.product.description,
                    quantity: productInstance.quantity,
                    tagId: `${productInstance.id}-${productInstance.productId}`,
                    eventDate: event.eventDate,
                    type: movingType,
                  })),
                );
              }

              break;
            }

            const eventsSorted = productInstance.events.sort(
              (a, b) => a.eventDate.getTime() - b.eventDate.getTime(),
            );

            const depositEvent = eventsSorted.find(
              (event) => event.depositId === depositId,
            );

            const index = eventsSorted.indexOf(depositEvent);
            const isLastEvent = index === eventsSorted.length - 1;

            if (isLastEvent || !depositEvent) {
              break;
            }

            const nextEvent = eventsSorted[index + 1];

            if (nextEvent.eventDate.getMonth() === i) {
              totalAmount += productInstance.quantity;
              products.push({
                deposit: depositEvent.depositId,
                productId: productInstance.productId,
                productDescription: productInstance.product.description,
                quantity: productInstance.quantity,
                tagId: `${productInstance.id}-${productInstance.productId}`,
                eventDate: nextEvent.eventDate,
                type: movingType,
              });
            }

            break;
          default:
            throw new Error('Tipo de Movimentação inválido');
        }
      });

      productQuantityByMonth[month] = {
        name: monthName,
        monthNumber: i,
        totalAmount,
        products,
      };
    }

    return Object.values(productQuantityByMonth);
  }
}
