import { Body, Controller, Post } from '@nestjs/common';
import { CreateManyProductInstanceService } from '../../../providers/product/product-instance/create-many-product-instance.service';
import { CreateProductInstanceModel } from '../../../model/product/product-instance/create-product-instance.model';

@Controller('/product-instance')
export class CreateManyProductInstanceController {
  constructor(
    private readonly createManyProductInstanceService: CreateManyProductInstanceService,
  ) {}

  @Post('/create-many')
  async createManyProductInstance(
    @Body() payload: CreateProductInstanceModel[],
  ) {
    return await this.createManyProductInstanceService.execute(payload);
  }
}
