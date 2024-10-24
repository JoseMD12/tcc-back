import { Controller, Get, Res } from '@nestjs/common';
import { ExportProductsService } from '../../providers/product/export-products.service';
import { Response } from 'express';

@Controller('/product')
export class ExportProductsController {
  constructor(private readonly exportProductsService: ExportProductsService) {}

  @Get('/excel')
  async exportProducts(@Res() res: Response) {
    const buffer = await this.exportProductsService.exportProducts();

    res.setHeader('Content-Disposition', 'attachment; filename=produtos.xlsx');
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.send(buffer);
  }
}
