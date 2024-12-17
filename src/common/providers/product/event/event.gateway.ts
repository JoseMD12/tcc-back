import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any) {
    console.log('Cliente conectado:', client.id);
    console.log();
  }

  handleDisconnect(client: any) {
    console.log('Cliente disconectado:', client.id);
    console.log();
  }

  sendEventUpdate(message: string) {
    console.log('Enviando Sinal!');
    this.server.emit('event-update', message);
  }
}
