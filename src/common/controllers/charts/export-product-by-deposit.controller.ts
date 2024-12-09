import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ExportProductByDepositService } from '../../providers/charts/export-product-by-deposit.service';

@Controller('/excel/product-by-deposit')
export class ExportProductByDepositController {
  constructor(private readonly service: ExportProductByDepositService) {}

  @Get(':productId?')
  async exportProducts(
    @Res() res: Response,
    @Param('productId') productId?: string,
  ) {
    const buffer = await this.service.execute(productId);

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=produtos-totais.xlsx',
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.send(buffer);
  }
}
