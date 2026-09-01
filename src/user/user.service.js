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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt_1 = require("bcrypt");
const mysql_service_1 = require("../mysql/mysql.service");
const log_service_1 = require("../log/log.service");
const signal_service_1 = require("../gateways/socket/signal.service");
const signals_enum_1 = require("../gateways/socket/signals.enum");
let UserService = class UserService {
    constructor(mysqlService, logService, signalService) {
        this.mysqlService = mysqlService;
        this.logService = logService;
        this.signalService = signalService;
    }
    async changePassword(body, userId) {
        const saltRounds = 10;
        const hash = (0, bcrypt_1.hashSync)(body.password, saltRounds);
        await this.mysqlService.query('UPDATE Users SET Passhash = ? WHERE Username = ?', [hash, body.username]);
        await this.logService.log(11, userId);
    }
    async getAll() {
        return (await this.mysqlService.query('SELECT * FROM Users')).map((user) => ({
            ID: user.ID,
            Admin: user.Admin === 1,
            Username: user.Username,
            AllowMapUpload: user.AllowMapUpload === 1,
        }));
    }
    async setUserLink(mapId, userId, setterId, add) {
        if (!add) {
            const isAdmin = await this.isMapAdmin(mapId, userId);
            if (isAdmin)
                return new common_1.HttpException('Cannot remove an admin from the map.', common_1.HttpStatus.CONFLICT);
        }
        await this.logService.log(setterId, add ? 8 : 6);
        await this.mysqlService.query(add
            ? 'INSERT INTO UserMapLink (MapID, UserID) VALUES (?, ?)'
            : 'DELETE FROM UserMapLink WHERE MapID = ? AND UserID = ?', [mapId, userId]);
        this.signalService.sendSignal(signals_enum_1.Signals.Maps);
    }
    async setUserLinkAdmin(mapId, userId, setterId, enable) {
        if (!enable && (await this.isMapOwner(mapId, userId)))
            throw new common_1.HttpException("Cannot remove Map Owner's Admin", common_1.HttpStatus.FORBIDDEN);
        const link = (await this.mysqlService.query('SELECT UserID FROM UserMapLink WHERE MapID = ? AND UserID = ?', [mapId, userId]))[0];
        if (!link)
            await this.setUserLink(mapId, userId, setterId, true);
        await this.logService.log(setterId, enable ? 9 : 17);
        await this.mysqlService.query('UPDATE UserMapLink SET Admin = ? WHERE UserID = ? AND MapID = ?', [enable ? 1 : 0, userId, mapId]);
        this.signalService.sendSignal(signals_enum_1.Signals.Maps);
    }
    async getUserLinks(mapID) {
        const unselected = await this.mysqlService.query(`SELECT U.ID, Username
       FROM Users U
                LEFT JOIN Map.UserMapLink UML on U.ID = UML.UserID
                LEFT JOIN Map.Maps M on UML.MapID = M.ID
       WHERE U.ID NOT IN
             (SELECT U.ID
              FROM Users U
                       LEFT JOIN Map.UserMapLink UML on U.ID = UML.UserID
                       LEFT JOIN Map.Maps M on UML.MapID = M.ID
              WHERE M.ID IS NOT NULL
                AND M.ID = ?
                AND U.Admin = FALSE)
         AND U.Admin = FALSE
      `, [mapID]);
        const selected = await this.mysqlService.query(`
          SELECT U.ID, Username, UML.Admin
          FROM Users U
                   LEFT JOIN Map.UserMapLink UML on U.ID = UML.UserID
                   LEFT JOIN Map.Maps M on UML.MapID = M.ID
          WHERE M.ID = ?
            AND U.Admin = FALSE
      `, [mapID]);
        const userLinks = [];
        for (const selectedElement of selected) {
            userLinks.push({
                UserID: selectedElement.ID,
                Admin: selectedElement.Admin === 1,
                Username: selectedElement.Username,
                Selected: true,
            });
        }
        for (const selectedElement of unselected) {
            userLinks.push({
                UserID: selectedElement.ID,
                Admin: false,
                Username: selectedElement.Username,
                Selected: false,
            });
        }
        userLinks.sort((a, b) => a.Username.localeCompare(b.Username));
        return {
            mapID,
            links: userLinks,
        };
    }
    async isMapAdmin(mapId, userId) {
        return (((await this.mysqlService.query('SELECT Admin FROM UserMapLink WHERE UserID = ? AND MapID = ?', [userId, mapId]))[0]?.Admin ?? 0) === 1);
    }
    async isMapOwner(mapId, userId) {
        return ((await this.mysqlService.query('SELECT Creator FROM Maps WHERE ID = ?', [mapId]))[0].Creator == userId);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mysql_service_1.MysqlService,
        log_service_1.LogService,
        signal_service_1.SignalService])
], UserService);
//# sourceMappingURL=user.service.js.map