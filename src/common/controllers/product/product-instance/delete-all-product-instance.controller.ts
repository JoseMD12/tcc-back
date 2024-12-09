import { Controller, Delete } from '@nestjs/common';
import { DeleteAllProductInstanceService } from '../../../providers/product/product-instance/delete-all-product-instance.service';

@Controller('/product-instance')
export class DeleteAllProductInstanceController {
  constructor(
    private readonly deleteAllProductInstanceService: DeleteAllProductInstanceService,
  ) {}

  @Delete()
  async handle() {
    return this.deleteAllProductInstanceService.execute();
  }
}
