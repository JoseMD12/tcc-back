import { Controller, Get, Res } from '@nestjs/common';
import { ExportOrderService } from '../../providers/order/export-order.service';
import { Response } from 'express';

@Controller('/excel/order')
export class ExportOrderController {
  constructor(private readonly service: ExportOrderService) {}

  @Get()
  async exportOrder(@Res() res: Response) {
    const buffer = await this.service.exportOrder();

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=pedidos.xlsx');
    res.send(buffer);
  }
}
