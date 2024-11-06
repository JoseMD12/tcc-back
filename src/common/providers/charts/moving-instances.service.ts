import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';

@Injectable()
export class MovingInstancesService {
  constructor(private readonly database: PrismaService) {}
  async execute(movingType: string, depositId?: string) {
    const productInstances = await this.database.productInstance.findMany({
      include: {
        product: true,
        events: true,
      },
    });

    const productQuantityByMonth: {
      [key: string]: { name: string; totalAmount: number };
    } = {};



    
  }
}
