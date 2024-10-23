import { Controller, Get } from '@nestjs/common';
import { ListProductInstanceService } from '../../../providers/product/productInstance/list-product-instance.service';

@Controller('/product-instance')
export class ListProductInstanceController {
  constructor(
    private readonly listProductInstanceService: ListProductInstanceService,
  ) {}

  @Get()
  async listProductInstance() {
    return await this.listProductInstanceService.execute();
  }
}
