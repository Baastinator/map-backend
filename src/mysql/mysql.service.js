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
exports.MysqlService = void 0;
const common_1 = require("@nestjs/common");
const mysql_1 = require("mysql");
const password_txt_1 = require("../password.txt");
const config_1 = require("@nestjs/config");
let MysqlService = class MysqlService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger();
        this.dbCon = (0, mysql_1.createConnection)({
            host: this.configService.get('databaseURI'),
            password: password_txt_1.password,
            user: 'root',
            port: 3306,
            database: 'Map',
        });
        this.dbCon.connect((error) => {
            if (error) {
                this.logger.error(error);
                throw error;
            }
        });
        this.logger.log('Connected to Database');
    }
    async query(query, params) {
        return new Promise((resolve, reject) => {
            this.dbCon.query(query, params ?? [], (err, results) => {
                if (err) {
                    this.logger.error(err);
                    reject(err);
                }
                else {
                    resolve(results);
                }
            });
        });
    }
};
exports.MysqlService = MysqlService;
exports.MysqlService = MysqlService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MysqlService);
//# sourceMappingURL=mysql.service.js.map