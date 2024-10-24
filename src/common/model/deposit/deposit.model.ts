import { EventType } from '@prisma/client';

export class DepositModel {
  name: string;
  type: EventType;
  maxQuantity: number;
}
