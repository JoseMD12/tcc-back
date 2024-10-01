import { Controller, Get } from '@nestjs/common';
import { ListProductsService } from '../../providers/product/list-products.service';
import { ProductModel } from '../../model/product/product.model';

@Controller('/product')
export class ListProductsController {
  constructor(private readonly listProductsService: ListProductsService) {}

  @Get()
  async listProducts(): Promise<ProductModel[]> {
    return this.listProductsService.execute();
  }
}
