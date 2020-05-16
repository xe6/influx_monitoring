import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Client, Socket } from 'socket.io';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';

@WebSocketGateway({ transports: ['websocket'] })
export class TsdbGateway implements NestGateway {
  private readonly logger: Logger = new Logger(TsdbGateway.name, true);

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('onsite')
  onsite(@MessageBody() data: { url: string }, @ConnectedSocket() clientSocket: Socket) {
    this.logger.log(`Received onsite data from client ${clientSocket.id}:`);
    const ip = clientSocket.client.request.connection.remoteAddress;
    this.logger.log(data);
  }

  handleConnection(client: Client, ...args: any[]): void {
    this.logger.log(`Client: ${client.id} connected.`);
  }

  handleDisconnect(client: Client): void {
    this.logger.log(`Client: ${client.id} disconnected.`);
  }
}
