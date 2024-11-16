import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';

@Injectable()
export class ListDepositsTypeService {
  constructor(private readonly database: PrismaService) {}

  async listDepositTypes() {
    const depositsTypes = [
      {
        enum: 'REGISTRATION',
        description: 'Registro',
      },
      {
        enum: 'DEPOSIT',
        description: 'Depósito',
      },
      {
        enum: 'TRANSPORTATION',
        description: 'Transporte',
      },
      {
        enum: 'DESTINATION',
        description: 'Destino',
      },
    ];

    return depositsTypes;
  }
}
