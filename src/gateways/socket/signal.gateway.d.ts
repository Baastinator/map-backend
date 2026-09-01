import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SignalService } from './signal.service';
export declare class SignalGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    private signalService;
    private clients;
    constructor(signalService: SignalService);
    afterInit(): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    private deleteConnection;
}
