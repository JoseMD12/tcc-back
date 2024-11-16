import { Controller, Get, Param } from '@nestjs/common';
import { DepositOccupationService } from '../../providers/charts/deposit-occupation.service';

@Controller('/deposit-occupation')
export class DepositOccupationController {
  constructor(
    private readonly depositOccupationService: DepositOccupationService,
  ) {}

  @Get(':depositId')
  async execute(@Param('depositId') depositId: string) {
    return this.depositOccupationService.execute(depositId);
  }
}
