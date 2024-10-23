import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';

@Injectable()
export class TotalInventoryService {
  constructor(private readonly database: PrismaService) {}

  async execute() {
    const products = await this.database.product.findMany();

    const productInstance = await this.database.productInstance.findMany();

    return {
      registeredProducts: products.length,
      circulationTags: productInstance.length,
    };
  }
}
