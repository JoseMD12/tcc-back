import { Controller, Get, Query, Res } from '@nestjs/common';
import { MovimentationType } from '../../model/deposit/movimentation-type';
import { ExportMovingInstancesService } from '../../providers/charts/export-moving-instances.service';
import { Response } from 'express';

@Controller('/excel/moving-instances')
export class ExportMovingInstancesController {
  constructor(private readonly service: ExportMovingInstancesService) {}

  @Get()
  async execute(
    @Res() res: Response,
    @Query('movingType') movingType: MovimentationType,
    @Query('depositId') depositId?: string,
    @Query('search') search?: string,
  ) {
    const buffer = await this.service.execute(movingType, depositId, search);

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=movimentacoes.xlsx',
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.send(buffer);
  }
}
