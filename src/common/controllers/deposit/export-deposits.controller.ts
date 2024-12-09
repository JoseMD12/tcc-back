import { Controller, Get, Res } from '@nestjs/common';
import { ExportDepositsService } from '../../providers/deposit/export-deposits.service';
import { Response } from 'express';

@Controller('/excel/deposit')
export class ExportDepositsController {
  constructor(private readonly service: ExportDepositsService) {}

  @Get()
  async exportDeposits(@Res() res: Response) {
    const buffer = await this.service.exportDeposits();

    res.setHeader('Content-Disposition', 'attachment; filename=depositos.xlsx');
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.send(buffer);
  }
}
