import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SignalService } from './signal.service';
import { Signals } from './signals.enum';
import { filter } from 'rxjs';

@WebSocketGateway(3333, {
  cors: true,
})
export class SignalGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private clients: Socket[] = [];

  constructor(private signalService: SignalService) {
    this.signalService
      .getSignal()
      .pipe(
        filter((signal: Signals | null): signal is Signals => signal !== null),
      )
      .subscribe((signal: Signals) => {
        this.clients.forEach((socket: Socket) => {
          socket.emit(signal);
        });
      });
  }

  public afterInit(): void {
    this.clients = [];
  }

  public handleConnection(client: Socket): void {
    this.clients.push(client);
  }

  public handleDisconnect(client: Socket): void {
    this.deleteConnection(client.id);
  }

  private deleteConnection(id: string): void {
    const index = this.clients.findIndex((socket: Socket) => socket.id === id);

    this.clients.splice(index, 1);
  }
}
