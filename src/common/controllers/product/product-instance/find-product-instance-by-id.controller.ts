import { Controller, Get, Param } from '@nestjs/common';
import { FindProductInstanceByIdService } from '../../../providers/product/product-instance/find-product-instance-by-id.service';

@Controller('/product-instance')
export class FindProductInstanceByIdController {
  constructor(private readonly service: FindProductInstanceByIdService) {}

  @Get('/:tagId')
  async findProductInstanceByTagId(@Param('tagId') tagId: string) {
    return await this.service.execute(tagId);
  }
}
