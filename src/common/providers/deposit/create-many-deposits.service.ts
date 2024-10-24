import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';
import { DepositModel } from '../../model/deposit/deposit.model';

@Injectable()
export class CreateManyDepositsService {
  constructor(private readonly database: PrismaService) {}

  async execute(payload: DepositModel[]) {
    const existingDeposit = await this.database.deposit.findFirst({
      where: {
        name: {
          in: payload.map((deposit) => deposit.name),
        },
      },
      select: {
        name: true,
      },
    });

    if (existingDeposit) {
      throw new Error('Depósito já existe: ' + existingDeposit.name);
    }

    const deposits = await this.database.deposit.createMany({
      data: payload,
    });

    return deposits.count;
  }
}
