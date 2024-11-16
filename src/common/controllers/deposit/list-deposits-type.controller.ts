import { Controller, Get } from '@nestjs/common';
import { ListDepositsTypeService } from '../../providers/deposit/list-deposits-type.service';

@Controller('/deposit')
export class ListDepositsTypeController {
  constructor(private readonly service: ListDepositsTypeService) {}

  @Get('/type')
  async listDepositTypes() {
    return this.service.listDepositTypes();
  }
}
