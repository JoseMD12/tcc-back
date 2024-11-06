import { Body, Controller, Post } from '@nestjs/common';
import { Product } from '@prisma/client';
import { CreateManyProductsService } from '../../providers/product/create-many-products.service';
import { ProductModel } from '../../model/product/product.model';

@Controller('/product')
export class CreateManyProductsController {
  constructor(
    private readonly createManyProductsService: CreateManyProductsService,
  ) {}

  @Post('/create-many')
  async createManyProducts(@Body() payload: ProductModel[]): Promise<number> {
    return this.createManyProductsService.execute(payload);
  }
}
