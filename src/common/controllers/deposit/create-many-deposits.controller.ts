import { Body, Controller, Post } from '@nestjs/common';
import { Deposit } from '@prisma/client';
import { CreateManyDepositsService } from '../../providers/deposit/create-many-deposits.service';
import { DepositModel } from '../../model/deposit/deposit.model';

@Controller('/deposit')
export class CreateManyDepositsController {
  constructor(
    private readonly createManyDepositsService: CreateManyDepositsService,
  ) {}

  @Post('/create-many')
  async createManyDeposits(@Body() deposits: DepositModel[]): Promise<number> {
    return this.createManyDepositsService.execute(deposits);
  }
}
