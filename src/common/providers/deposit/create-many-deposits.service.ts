import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';
import { DepositModel } from '../../model/deposit/deposit.model';
import { Deposit } from '@prisma/client';

@Injectable()
export class CreateManyDepositsService {
  constructor(private readonly database: PrismaService) {}

  async execute(payload: DepositModel[]) {
    const existingStorageZones = await this.database.deposit.findMany({
      where: {
        storageZones: {
          hasSome: payload.flatMap((deposit) => deposit.storageZones),
        },
      },
      select: {
        storageZones: true,
      },
    });

    const allStorageZones = payload.flatMap((deposit) => deposit.storageZones);

    if (existingStorageZones.length > 0) {
      throw new Error(
        'Zonas de Armazenamento em uso: ' +
          existingStorageZones
            .flatMap((deposit) => deposit.storageZones)
            .filter((zone) => allStorageZones.includes(zone)),
      );
    }

    const storageZoneCounts = allStorageZones.reduce(
      (acc, zone) => {
        acc[zone] = (acc[zone] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const duplicatedStorageZones = Object.keys(storageZoneCounts).filter(
      (zone) => storageZoneCounts[zone] > 1,
    );

    if (duplicatedStorageZones.length) {
      throw new Error(
        'Zonas de Armazenamento Duplicadas: ' + duplicatedStorageZones,
      );
    }

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
