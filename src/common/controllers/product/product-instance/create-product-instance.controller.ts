import { Body, Controller, Post } from '@nestjs/common';
import { CreateProductInstanceModel } from '../../../model/product/product-instance/create-product-instance.model';
import { CreateProductInstanceService } from '../../../providers/product/product-instance/create-product-instance.service';

@Controller('/product-instance')
export class CreateProductInstanceController {
  constructor(
    private readonly createProductInstanceService: CreateProductInstanceService,
  ) {}

  @Post()
  async createProductInstance(@Body() payload: CreateProductInstanceModel) {
    return await this.createProductInstanceService.execute(payload);
  }
}
