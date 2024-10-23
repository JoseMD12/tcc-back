import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';

@Injectable()
export class ListDepositsService {
  constructor(private readonly database: PrismaService) {}

  async execute() {
    return this.database.deposit.findMany();
  }
}
