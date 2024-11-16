import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';
import * as ExcelJS from 'exceljs';
import { ListDepositsTypeService } from './list-deposits-type.service';

@Injectable()
export class ExportDepositsService {
  constructor(
    private readonly database: PrismaService,
    private readonly listTypes: ListDepositsTypeService,
  ) {}

  async exportDeposits() {
    const types = await this.listTypes.listDepositTypes();
    const deposits = await this.database.deposit.findMany();
    const productInstances = await this.database.productInstance.findMany({
      include: {
        product: true,
        events: {
          orderBy: {
            eventDate: 'desc',
          },
          take: 1,
        },
      },
    });

    const productQuantityByDepositId: {
      [key: string]: number;
    } = {};

    deposits.forEach((deposit) => {
      productQuantityByDepositId[deposit.id] = 0;
    });

    productInstances.forEach((productInstance) => {
      const lastEvent = productInstance.events[0];

      if (lastEvent && productInstance.quantity > 0) {
        productQuantityByDepositId[lastEvent.depositId] +=
          productInstance.quantity;
      }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Depósitos Cadastrados');

    worksheet.columns = [
      {
        header: 'Nome do Depósito',
        key: 'id',
        width: 35,
      },
      { header: 'Tipo do Depósito', key: 'type', width: 35 },
      { header: 'Quantidade Máxima', key: 'maxQuantity', width: 25 },
      { header: 'Quantidade Utilizada', key: 'usedQuantity', width: 25 },
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

    deposits.forEach((deposit) => {
      worksheet.addRow({
        id: deposit.name,
        type: types.find((type) => type.enum === deposit.type)?.description,
        maxQuantity: deposit.maxQuantity,
        usedQuantity: productQuantityByDepositId[deposit.id] || 0,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}
