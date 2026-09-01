"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignalGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const signal_service_1 = require("./signal.service");
const rxjs_1 = require("rxjs");
let SignalGateway = class SignalGateway {
    constructor(signalService) {
        this.signalService = signalService;
        this.clients = [];
        this.signalService
            .getSignal()
            .pipe((0, rxjs_1.filter)(Boolean))
            .subscribe((signal) => {
            this.clients.forEach((socket) => {
                socket.emit(signal);
            });
        });
    }
    afterInit() {
        this.clients = [];
    }
    handleConnection(client) {
        this.clients.push(client);
    }
    handleDisconnect(client) {
        this.deleteConnection(client.id);
    }
    deleteConnection(id) {
        const index = this.clients.findIndex((socket) => socket.id === id);
        this.clients.splice(index, 1);
    }
};
exports.SignalGateway = SignalGateway;
exports.SignalGateway = SignalGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(3434, {
        cors: true,
    }),
    __metadata("design:paramtypes", [signal_service_1.SignalService])
], SignalGateway);
//# sourceMappingURL=signal.gateway.js.map