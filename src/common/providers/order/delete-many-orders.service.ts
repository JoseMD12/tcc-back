import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';

@Injectable()
export class DeleteManyOrdersService {
  constructor(private readonly database: PrismaService) {}

  async execute(payload: string[]) {
    return this.database.order.deleteMany({
      where: {
        id: {
          in: payload,
        },
      },
    });
  }
}
