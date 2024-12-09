import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';
import * as ExcelJS from 'exceljs';
import { MovingInstancesService } from './moving-instances.service';
import { MovimentationType } from '../../model/deposit/movimentation-type';

@Injectable()
export class ExportMovingInstancesService {
  constructor(
    private readonly database: PrismaService,
    private readonly service: MovingInstancesService,
  ) {}

  async execute(
    movingType: MovimentationType,
    depositId?: string,
    search?: string,
  ) {
    const deposits = await this.database.deposit.findMany();
    const depositNamesById = new Map<string, string>(
      deposits.map((deposit) => [deposit.id, deposit.name]),
    );

    const data = await this.service.execute(movingType, depositId, search);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Movimentação`);

    worksheet.columns = [
      {
        header: 'Depósito',
        key: 'deposit',
        width: 70,
      },
      {
        header: 'Código do Produto',
        key: 'productId',
        width: 40,
      },
      {
        header: 'Produto',
        key: 'productDescription',
        width: 50,
      },
      {
        header: 'Quantidade',
        key: 'quantity',
        width: 20,
      },
      {
        header: 'Código da Etiqueta',
        key: 'tagId',
        width: 50,
      },
      {
        header: 'Data da Mov.',
        key: 'date',
        width: 20,
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

    data
      .flatMap((value) => value.products)
      .forEach((item) => {
        worksheet.addRow({
          deposit: depositNamesById.get(item.deposit),
          productId: item.productId,
          productDescription: item.productDescription,
          quantity: item.quantity,
          tagId: item.tagId,
          date: item.eventDate.toLocaleDateString('pt-BR'),
        });
      });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}
