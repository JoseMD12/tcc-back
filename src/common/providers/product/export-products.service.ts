import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';
import * as ExcelJS from 'exceljs';
import { DateTime } from 'luxon';

@Injectable()
export class ExportProductsService {
  constructor(private readonly database: PrismaService) {}

  async exportProducts() {
    const products = await this.database.product.findMany();
    const productsInstances = await this.database.productInstance.findMany({
      include: {
        product: true,
      },
    });

    const productIntanceCountByProductId = productsInstances.reduce(
      (acc, productInstance) => {
        acc[productInstance.productId] =
          acc[productInstance.productId] + 1 || 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Produtos Cadastrados');

    worksheet.columns = [
      {
        header: 'Id do Produto',
        key: 'id',
        width: 20,
      },
      { header: 'Descrição', key: 'product', width: 35 },
      { header: 'Tags Ativas', key: 'tags_count', width: 15 },
      { header: 'Data de Criação', key: 'created_at', width: 20 },
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

    products.forEach((product) => {
      worksheet.addRow({
        id: product.id,
        product: product.description,
        tags_count: productIntanceCountByProductId[product.id] || 0,
        created_at: DateTime.fromJSDate(product.createdAt).toFormat(
          'dd/MM/yyyy',
        ),
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}
