import { Controller, Get, Res } from '@nestjs/common';
import { ExportProductInstanceService } from '../../../providers/product/product-instance/export-product-instance.service';
import { Response } from 'express';

@Controller('/product-instance')
export class ExportProductInstanceController {
  constructor(
    private readonly exportProductInstanceService: ExportProductInstanceService,
  ) {}

  @Get('/excel')
  async exportProductInstance(@Res() res: Response) {
    const buffer = await this.exportProductInstanceService.execute();

    res.setHeader('Content-Disposition', 'attachment; filename=etiquetas.xlsx');
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.send(buffer);
  }
}
