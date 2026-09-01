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
exports.PinService = void 0;
const common_1 = require("@nestjs/common");
const mysql_service_1 = require("../mysql/mysql.service");
const pin_dto_1 = require("./models/pin.dto");
const signal_service_1 = require("../gateways/socket/signal.service");
const signals_enum_1 = require("../gateways/socket/signals.enum");
const log_service_1 = require("../log/log.service");
let PinService = class PinService {
    constructor(mysqlService, signalService, logService) {
        this.mysqlService = mysqlService;
        this.signalService = signalService;
        this.logService = logService;
    }
    async getAll() {
        return (await this.mysqlService.query('SELECT * FROM Pins')).map(pin_dto_1.toPinDto);
    }
    async getById(id) {
        return (await this.mysqlService.query('SELECT * FROM Pins WHERE ID = ?', [id])).map(pin_dto_1.toPinDto)[0];
    }
    async getByMapId(mapId) {
        return (await this.mysqlService.query('SELECT * FROM Pins WHERE MapID = ?', [mapId])).map(pin_dto_1.toPinDto);
    }
    async createNew(body, userId) {
        await this.mysqlService.query('INSERT INTO Pins (Name, X, Y, Content, MapID) VALUES (?, ?, ?, ?, ?)', [body.name, String(body.x), String(body.y), body.content, body.mapId]);
        await this.logService.log(userId, 2);
        this.signalService.sendSignal(signals_enum_1.Signals.Pins);
    }
    async deleteById(id, userId) {
        await this.mysqlService.query('DELETE FROM Pins WHERE ID = ?', [id]);
        await this.logService.log(userId, 13);
        this.signalService.sendSignal(signals_enum_1.Signals.Pins);
    }
    async update(data, userId) {
        await this.mysqlService.query('UPDATE Pins SET Name = ?, Content = ? WHERE ID = ?', [data.Name, data.Content, data.ID]);
        await this.logService.log(userId, 18);
        this.signalService.sendSignal(signals_enum_1.Signals.Pins);
    }
    async isMapAdmin(pinId, userId) {
        const result = await this.mysqlService.query(`SELECT UML.Admin
       FROM Pins P
                JOIN Maps M on M.ID = P.MapID
                JOIN UserMapLink UML on M.ID = UML.MapID
                JOIN Map.Users U on UML.UserID = U.ID
       WHERE P.ID = ?
         AND U.ID = ?`, [pinId, userId]);
        console.log(result);
        if (result.length == 0)
            return false;
        return result[0].Admin === 1;
    }
};
exports.PinService = PinService;
exports.PinService = PinService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mysql_service_1.MysqlService,
        signal_service_1.SignalService,
        log_service_1.LogService])
], PinService);
//# sourceMappingURL=pin.service.js.map