export class OrderModel {
  orderDate: string;
  products: {
    productId: string;
    quantity: number;
  }[];
}
