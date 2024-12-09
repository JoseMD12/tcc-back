import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import { ExportStockProjectionService } from '../../providers/charts/export-stock-projection.service';
import { Response } from 'express';

@Controller('/excel/stock-projection')
export class ExportStockProjectionController {
  constructor(private readonly service: ExportStockProjectionService) {}

  @Get()
  async exportProducts(
    @Res() res: Response,
    @Query('productId') productId: string,
    @Query('newOrdersState') newOrdersState: boolean,
    @Query('depositId') depositId?: string,
  ) {
    if (!productId) {
      throw new BadRequestException('ProductId parameter is required');
    }

    const buffer = await this.service.execute(
      productId,
      newOrdersState,
      depositId,
    );

    res.setHeader('Content-Disposition', 'attachment; filename=projecao.xlsx');
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.send(buffer);
  }
}
