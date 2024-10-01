import { Body, Controller, Delete } from '@nestjs/common';
import { DeleteManyProductsService } from '../../providers/product/delete-many-products.service';

@Controller('/product')
export class DeleteManyProductsController {
  constructor(
    private readonly deleteManyProductsService: DeleteManyProductsService,
  ) {}

  @Delete('/delete-many')
  async deleteManyProducts(@Body() products: string[]): Promise<number> {
    return this.deleteManyProductsService.execute(products);
  }
}
