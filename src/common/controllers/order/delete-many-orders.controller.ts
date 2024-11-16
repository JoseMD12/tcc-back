import { Body, Controller, Delete } from '@nestjs/common';
import { DeleteManyOrdersService } from '../../providers/order/delete-many-orders.service';

@Controller('/order')
export class DeleteManyOrdersController {
  constructor(
    private readonly deleteManyOrdersService: DeleteManyOrdersService,
  ) {}

  @Delete('/delete-many')
  async deleteManyOrders(@Body() payload: string[]) {
    return this.deleteManyOrdersService.execute(payload);
  }
}
