import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';

@Injectable()
export class DeleteManyProductsService {
  constructor(private readonly database: PrismaService) {}

  async execute(payload: string[]): Promise<number> {
    const validProducts = (
      await this.database.product.findMany({
        where: {
          id: {
            in: payload,
          },
        },
      })
    ).map((product) => product.id);

    if (validProducts.length > 0) {
      const deletedProducts = await this.database.product.deleteMany({
        where: {
          id: {
            in: validProducts,
          },
        },
      });
      return deletedProducts.count;
    }

    return 0;
  }
}
