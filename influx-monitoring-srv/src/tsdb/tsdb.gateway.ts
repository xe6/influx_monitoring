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
import { ConfigService, EnvConfig } from '../config';
import { TsdbService } from './tsdb.service';

@WebSocketGateway({ transports: ['websocket'] })
export class TsdbGateway implements NestGateway {
  constructor(
    private readonly configService: ConfigService,
    private readonly tsdbService: TsdbService,
  ) {
    this.visitorUniqueByIpMode = this.configService.get<boolean>(
      EnvConfig.VISITOR_UNIQUE_BY_IP_MODE,
    );
  }

  private readonly logger: Logger = new Logger(TsdbGateway.name, true);
  private readonly visitorUniqueByIpMode: boolean = false;

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('onsite')
  public async onsite(
    @MessageBody() data: { url: string },
    @ConnectedSocket() clientSocket: Socket,
  ) {
    if (this.visitorUniqueByIpMode) {
      const ip = clientSocket.client.request.connection.remoteAddress;
      const wsidAlreadyConnected = await this.tsdbService.getVisitorIpInKV(ip);
      if (wsidAlreadyConnected && wsidAlreadyConnected !== clientSocket.id) {
        this.logger.error(
          `
          Received duplicated connection from the same IP.\n
          WSID-IP Active Pair: ${ip} <--> ${wsidAlreadyConnected}\n
          WSID-IP Current Pair: ${ip} <--> ${clientSocket.id}\n
          Message ignored.\n
          `,
        );
        return; // Ignore connection and exit method
      }
    }
    this.logger.log(`Received onsite data from client ${clientSocket.id}:`);
    this.logger.log(data);
  }

  public async handleConnection(client: Client, ...args: any[]): Promise<void> {
    if (this.visitorUniqueByIpMode) {
      const ip = client.request.connection.remoteAddress;
      await this.tsdbService.putVisitorIpInKV(ip, client.id);
    }

    this.logger.log(`Client: ${client.id} connected.`);
  }

  public async handleDisconnect(client: Client): Promise<void> {
    if (this.visitorUniqueByIpMode) {
      const ip = client.request.connection.remoteAddress;
      await this.tsdbService.removeVisitorIpInKV(ip);
    }
    this.logger.log(`Client: ${client.id} disconnected.`);
  }
}
