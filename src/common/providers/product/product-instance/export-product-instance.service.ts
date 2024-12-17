import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/database.service';
import * as ExcelJS from 'exceljs';
import { DateTime } from 'luxon';

@Injectable()
export class ExportProductInstanceService {
  constructor(private readonly database: PrismaService) {}

  async execute() {
    const productInstances = await this.database.productInstance.findMany({
      include: {
        product: true,
        events: {
          orderBy: {
            eventDate: 'desc',
          },
          take: 2,
        },
      },
    });

    const deposits = await this.database.deposit.findMany();
    const depositsById = deposits.reduce(
      (acc, deposit) => {
        acc[deposit.id] = deposit.name;
        return acc;
      },
      {} as Record<string, string>,
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Produtos em Circulação');

    worksheet.columns = [
      {
        header: 'Id da Tag',
        key: 'id',
        width: 20,
      },
      { header: 'Produto', key: 'product', width: 35 },
      { header: 'Quantidade', key: 'quantity', width: 10 },
      { header: 'Data de Entrada', key: 'fifo', width: 20 },
      { header: 'Depósito Atual', key: 'deposit', width: 20 },
      {
        header: 'Data da Última Movimentação',
        key: 'lastEventDate',
        width: 35,
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

    productInstances
      .sort((productInstance) => {
        return productInstance.events[0]?.eventDate
          ? productInstance.events[0].eventDate.getTime()
          : Number.MIN_SAFE_INTEGER;
      })
      .forEach((productInstance) => {
        worksheet.addRow({
          id: productInstance.id,
          product: productInstance.product.id,
          quantity: productInstance.quantity,
          fifo: DateTime.fromJSDate(productInstance.FIFO)
            .setZone('America/Sao_Paulo')
            .toFormat('dd/MM/yyyy'),
          deposit: depositsById[productInstance.events[0]?.depositId] ?? 'N/A',
          lastEventDate: productInstance.events[0]?.eventDate
            ? DateTime.fromJSDate(productInstance.events[0].eventDate)
                .setZone('America/Sao_Paulo')
                .toFormat('dd/MM/yyyy')
            : 'N/A',
        });
      });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}
