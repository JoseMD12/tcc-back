import { EventType } from '@prisma/client';

export class DepositModel {
  name: string;
  type: EventType;
  storageZones: string[];
  maxQuantity: number;
}
