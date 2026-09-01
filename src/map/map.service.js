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
exports.MapService = void 0;
const common_1 = require("@nestjs/common");
const mysql_service_1 = require("../mysql/mysql.service");
const signal_service_1 = require("../gateways/socket/signal.service");
const signals_enum_1 = require("../gateways/socket/signals.enum");
const log_service_1 = require("../log/log.service");
let MapService = class MapService {
    constructor(mysqlService, signalService, logService) {
        this.mysqlService = mysqlService;
        this.signalService = signalService;
        this.logService = logService;
    }
    async getAll(user) {
        if (user.Admin == 1)
            return await this.mysqlService.query(`SELECT M.*
         FROM Maps M`);
        return await this.mysqlService.query(`SELECT M.*
       FROM Maps M
                JOIN Map.UserMapLink UML on M.ID = UML.MapID
       WHERE UserID = ?`, [user.ID]);
    }
    async getById(id) {
        return (await this.mysqlService.query('SELECT * FROM Maps WHERE ID = ?', [id]))[0];
    }
    async getMapOwnersById(id) {
        return (await this.mysqlService.query(`SELECT U.ID
         FROM Users U
                  JOIN Map.UserMapLink UML on U.ID = UML.UserID
                  JOIN Map.Maps M on M.ID = UML.MapID
         WHERE MapID = ?
           AND UML.Admin = 1
        `, [id])).map(({ ID }) => ID);
    }
    async create(body, userID) {
        const { insertId } = await this.mysqlService.query('INSERT INTO Maps (Name, ImageURL, Creator) VALUES (?, ?, ?)', [body.name, body.url, userID]);
        console.log(insertId);
        await this.logService.log(userID, 1);
        await this.mysqlService.query('INSERT INTO UserMapLink (UserID, MapID, Admin) VALUES (?, ?, 1)', [userID, insertId]);
        this.signalService.sendSignal(signals_enum_1.Signals.Maps);
    }
    async setImageUrl(id, url, userId) {
        await this.mysqlService.query('UPDATE Maps SET ImageURL = ? WHERE ID = ?', [url, id]);
        await this.logService.log(userId, 14);
        this.signalService.sendSignal(signals_enum_1.Signals.Maps);
    }
    async deleteMap(mapId, userId) {
        const owners = await this.mysqlService.query(`
          SELECT UserID
          FROM Users U
                   JOIN Map.UserMapLink UML on U.ID = UML.UserID
                   JOIN Map.Maps M on M.ID = UML.MapID
          WHERE MapID = ?
            AND UML.Admin = 1`, [mapId]);
        const isOwner = owners
            .map((owner) => owner.UserID)
            .includes(userId);
        const isAdmin = (await this.mysqlService.query('SELECT Admin FROM Users WHERE ID = ?', [userId]))[0].Admin === 1;
        if (!isAdmin && !isOwner)
            return new common_1.HttpException('FORBIDDEN', common_1.HttpStatus.FORBIDDEN);
        await this.mysqlService.query('DELETE FROM UserMapLink WHERE MapID = ?', [mapId]);
        await this.mysqlService.query('DELETE FROM Maps WHERE ID = ?', [
            mapId,
        ]);
        await this.logService.log(userId, 12);
        this.signalService.sendSignal(signals_enum_1.Signals.Maps);
    }
};
exports.MapService = MapService;
exports.MapService = MapService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mysql_service_1.MysqlService,
        signal_service_1.SignalService,
        log_service_1.LogService])
], MapService);
//# sourceMappingURL=map.service.js.map