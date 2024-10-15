import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/database.service';

@Injectable()
export class ListProductInstanceService {
  constructor(private readonly database: PrismaService) {}

  async execute() {
    return await this.database.productInstance.findMany({
      include: {
        product: true,
        events: true,
      },
    });
  }
}
