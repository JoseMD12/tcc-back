import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';
import * as ExcelJS from 'exceljs';
import { ProductByDepositService } from './product-by-deposit.service';

@Injectable()
export class ExportProductByDepositService {
  constructor(
    private readonly database: PrismaService,
    private readonly service: ProductByDepositService,
  ) {}

  async execute(productId?: string) {
    const data = await this.service.execute(productId);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Produtos Totais');

    const productColumnLabel = productId
      ? `Quantidade Total de ${productId}`
      : 'Quantidade Total de Produtos';

    const productColumnSize = productId ? 70 : 35;

    worksheet.columns = [
      {
        header: 'Depósito',
        key: 'name',
        width: 70,
      },
      {
        header: productColumnLabel,
        key: 'totalAmount',
        width: productColumnSize,
      },
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
        name: value.name,
        totalAmount: value.totalAmount,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}
