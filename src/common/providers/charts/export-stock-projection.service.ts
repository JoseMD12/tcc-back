import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';
import * as ExcelJS from 'exceljs';
import { StockProjectionService } from './stock-projection.service';

@Injectable()
export class ExportStockProjectionService {
  constructor(
    private readonly database: PrismaService,
    private readonly service: StockProjectionService,
  ) {}

  async execute(
    productId: string,
    newOrdersState: boolean,
    depositId?: string,
  ) {
    const data = await this.service.getStockProjection(
      productId,
      newOrdersState,
      depositId,
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Projeção de Estoque');

    worksheet.columns = [
      {
        header: 'Data',
        key: 'orderDate',
        width: 35,
      },
      { header: 'Planejado Acumulado', key: 'lastOrder', width: 25 },
      { header: 'Planejado', key: 'order', width: 15 },
      { header: 'Saldo Acumulado', key: 'lastStock', width: 25 },
      { header: 'Saldo', key: 'stock', width: 15 },
      { header: 'Subtotal', key: 'subtotal', width: 20 },
    ];

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = {
        color: { argb: 'FFFFFFFF' },
        bold: true,
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE97132' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    data.forEach((value) => {
      worksheet.addRow({
        orderDate: value.date,
        lastOrder: value.lastDayOrder,
        order: value.order - value.lastDayOrder,
        lastStock: value.lastDayStock,
        stock: value.stock - value.lastDayStock,
        subtotal: value.subtotal,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}
