import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';

@Injectable()
export class DeleteManyDepositsService {
  constructor(private readonly database: PrismaService) {}

  async execute(payload: string[]): Promise<number> {
    const deposits = await this.database.deposit.deleteMany({
      where: {
        id: {
          in: payload,
        },
      },
    });

    return deposits.count;
  }
}
