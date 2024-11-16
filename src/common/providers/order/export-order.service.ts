import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExportOrderService {
  constructor(private readonly database: PrismaService) {}
  async exportOrder() {
    const orders = await this.database.order.findMany({
      include: {
        products: true,
      },
    });

    const products = await this.database.product.findMany();
    const productsById = products.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {});

    const orderProducts = orders
      .map((order) => {
        return order.products.map((product) => {
          return {
            date: order.orderDate.toLocaleDateString('pt-BR'),
            code: product.productId,
            name: productsById[product.productId].description,
            quantity: product.quantity,
          };
        });
      })
      .flat();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Pedidos Cadastrados');

    worksheet.columns = [
      {
        header: 'Data do Pedido',
        key: 'date',
        width: 25,
      },
      { header: 'Código do Produto', key: 'code', width: 40 },
      { header: 'Nome do Produto', key: 'name', width: 40 },
      { header: 'Quantidade', key: 'quantity', width: 30 },
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

    orderProducts.forEach((orderProduct) => {
      worksheet.addRow(orderProduct);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}
