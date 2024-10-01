import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';
import { ProductModel } from '../../model/product/product.model';

@Injectable()
export class ListProductsService {
  constructor(private readonly database: PrismaService) {}

  async execute(): Promise<ProductModel[]> {
    const products = await this.database.product.findMany();
    return products.map((product) => new ProductModel(product));
  }
}
