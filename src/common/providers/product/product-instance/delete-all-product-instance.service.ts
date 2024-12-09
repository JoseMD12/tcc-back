import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/database.service';

@Injectable()
export class DeleteAllProductInstanceService {
  constructor(private readonly database: PrismaService) {}

  async execute() {
    await this.database.productInstance.deleteMany();
  }
}
