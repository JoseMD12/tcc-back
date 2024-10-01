import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';
import { ProductModel } from '../../model/product/product.model';

@Injectable()
export class CreateManyProductsService {
  constructor(private readonly database: PrismaService) {}

  async execute(payload: ProductModel[]): Promise<number> {
    const invalidProductsId = (
      await this.database.product.findMany({
        where: {
          id: {
            in: payload.map((product) => product.id),
          },
        },
      })
    ).map((product) => product.id);

    const validProducts = payload.filter(
      (product) => !invalidProductsId.includes(product.id),
    );

    if (validProducts.length > 0) {
      const createdProducts = await this.database.product.createMany({
        data: validProducts,
      });
      return createdProducts.count;
    }

    return 0;
  }
}
