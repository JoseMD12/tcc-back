import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/database.service';

@Injectable()
export class DeleteEventByIdService {
  constructor(private readonly database: PrismaService) {}

  async execute(id: string) {
    return await this.database.event.delete({ where: { id } });
  }
}
