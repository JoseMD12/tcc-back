import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/database.service';
import { CreateProductInstanceService } from './create-product-instance.service';
import { CreateProductInstanceModel } from '../../../model/product/product-instance/create-product-instance.model';

@Injectable()
export class CreateManyProductInstanceService {
  constructor(
    private readonly database: PrismaService,
    private readonly service: CreateProductInstanceService,
  ) {}

  async execute(payload: CreateProductInstanceModel[]) {
    for (const productInstance of payload) {
      await this.service.execute(productInstance);
    }
  }
}
