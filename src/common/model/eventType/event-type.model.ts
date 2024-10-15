import { EventType } from '@prisma/client';

export const EventTypeLabels = [
  {
    type: EventType.REGISTRATION,
    label: 'Registro',
  },
  {
    type: EventType.DEPOSIT,
    label: 'Depósito de Produto',
  },
  {
    type: EventType.TRANSPORTATION,
    label: 'Transporte',
  },
  {
    type: EventType.DESTINATION,
    label: 'Destino/Saída',
  },
];
