import { Body, Controller, Post } from '@nestjs/common';
import { Product } from '@prisma/client';
import { CreateManyProductsService } from '../../providers/product/create-many-products.service';

@Controller('/product')
export class CreateManyProductsController {
  constructor(
    private readonly createManyProductsService: CreateManyProductsService,
  ) {}

  @Post('/create-many')
  async createManyProducts(@Body() products: Product[]): Promise<number> {
    return this.createManyProductsService.execute(products);
  }
}
