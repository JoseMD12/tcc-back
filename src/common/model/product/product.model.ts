import { Product as ProductModelPrisma } from '@prisma/client';

export class ProductModel {
  constructor(product: ProductModelPrisma) {
    this.id = product.id;
    this.description = product.description;
  }

  id: string;
  description: string;
}
