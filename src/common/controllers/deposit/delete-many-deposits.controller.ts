import { Body, Controller, Delete } from '@nestjs/common';
import { DeleteManyDepositsService } from '../../providers/deposit/delete-many-deposits.service';

@Controller('/deposit')
export class DeleteManyDepositsController {
  constructor(
    private readonly deleteManyDepositsService: DeleteManyDepositsService,
  ) {}

  @Delete('/delete-many')
  async deleteManyDeposits(@Body() deposits: string[]): Promise<number> {
    return this.deleteManyDepositsService.execute(deposits);
  }
}
