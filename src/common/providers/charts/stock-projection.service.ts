import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';

@Injectable()
export class StockProjectionService {
  constructor(private readonly database: PrismaService) {}

  async getStockProjection(
    productId: string,
    newOrdersState: boolean,
    depositId?: string,
  ) {
    let productInstances = await this.database.productInstance.findMany({
      where: {
        OR: [
          { productId: productId },
          { product: { description: { contains: productId } } },
        ],
      },
      select: {
        FIFO: true,
        quantity: true,
        events: {
          orderBy: { eventDate: 'desc' },
          take: 1,
        },
      },
    });

    if (depositId) {
      const deposit = await this.database.deposit.findFirst({
        where: { id: depositId },
      });

      if (!deposit) {
        throw new Error('Depósito não encontrado');
      }

      productInstances = productInstances.filter((productInstance) => {
        return productInstance.events[0].depositId == depositId;
      });
    }

    let orders = await this.database.order.findMany({
      include: {
        products: true,
      },
      where: {
        products: {
          some: {
            OR: [
              { productId: productId },
              { product: { description: { contains: productId } } },
            ],
          },
        },
      },
    });

    const onlyNew = newOrdersState.toString() === 'true' ? true : false;
    if (onlyNew) {
      const today = new Date();

      // productInstances = productInstances
      //   .map((productInstance) => {
      //     const validEvents = productInstance.events.filter(
      //       (event) => event.eventDate >= today,
      //     );

      //     productInstance.events = validEvents;

      //     return productInstance;
      //   })
      //   .filter((productInstance) => {
      //     return productInstance.events.length > 0;
      //   });

      orders = orders.filter((order) => {
        return order.orderDate >= today;
      });
    }

    const products = await this.database.product.findMany();

    const productDict: {
      [key: string]: string;
    } = products.reduce((acc, product) => {
      acc[product.description] = product.id;
      return acc;
    }, {});

    const orderAndStockPerDay: {
      [key: string]: { order: number; stock: number };
    } = orders
      .sort(
        (a, b) =>
          new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime(),
      )
      .reduce((acc, order) => {
        const orderDate = new Date(order.orderDate).toLocaleDateString('pt-BR');
        if (!acc[orderDate]) {
          acc[orderDate] = {
            order: 0,
            stock: 0,
          };
        }
        acc[orderDate].order += order.products
          .filter((product) => {
            const productIdByDescription = productDict[productId];
            return (
              product.productId === productId ||
              product.productId === productIdByDescription
            );
          })
          .map((product) => product.quantity)
          .reduce((acc, quantity) => acc + quantity, 0);
        return acc;
      }, {});

    productInstances.forEach((productInstance) => {
      const ordersDays = Object.keys(orderAndStockPerDay).map((day) => {
        const [dayNumber, month, year] = day.split('/');
        return new Date(+year, +month - 1, +dayNumber);
      });

      const nearestOrderDay = ordersDays.reduce((acc, day) => {
        if (
          Math.abs(day.getTime() - productInstance.FIFO.getTime()) <=
          Math.abs(acc.getTime() - productInstance.FIFO.getTime())
        ) {
          return day;
        }
        return acc;
      }, ordersDays[0]);

      const nearestOrderDayString = nearestOrderDay.toLocaleDateString('pt-BR');
      orderAndStockPerDay[nearestOrderDayString].stock +=
        productInstance.quantity;
    });

    const data = Object.keys(orderAndStockPerDay).map((day) => {
      return {
        date: day,
        stock: orderAndStockPerDay[day].stock,
        order: orderAndStockPerDay[day].order,
        lastDayOrder: 0,
        lastDayStock: 0,
        subtotal:
          orderAndStockPerDay[day].stock - orderAndStockPerDay[day].order,
      };
    });

    for (let index = 1; index < data.length; index++) {
      const element = data[index];
      const lastElement = data[index - 1];

      if (lastElement.subtotal <= 0) {
        element.order += lastElement.subtotal * -1;
        element.lastDayOrder += lastElement.subtotal * -1;
      } else {
        element.stock += lastElement.subtotal;
        element.lastDayStock += lastElement.subtotal;
      }

      element.subtotal = element.stock - element.order;
    }

    return data;
  }
}
