import { Controller, Get } from '@nestjs/common';
import { ListDepositsService } from '../../providers/deposit/list-deposits.service';

@Controller('/deposit')
export class ListDepositsController {
  constructor(private readonly listDepositsService: ListDepositsService) {}

  @Get()
  async listDeposits() {
    return this.listDepositsService.execute();
  }
}
