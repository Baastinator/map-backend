"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const mysql_module_1 = require("../mysql/mysql.module");
const config_1 = require("@nestjs/config");
const token_service_1 = require("./token.service");
const log_module_1 = require("../log/log.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        providers: [auth_service_1.AuthService, config_1.ConfigService, token_service_1.TokenService],
        imports: [mysql_module_1.MysqlModule, config_1.ConfigModule.forRoot(), log_module_1.LogModule],
        controllers: [auth_controller_1.AuthController],
        exports: [token_service_1.TokenService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map