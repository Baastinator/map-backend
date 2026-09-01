"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const map_controller_1 = require("./map/map.controller");
const map_service_1 = require("./map/map.service");
const image_controller_1 = require("./image/image.controller");
const config_1 = require("@nestjs/config");
const signal_service_1 = require("./gateways/socket/signal.service");
const signal_gateway_1 = require("./gateways/socket/signal.gateway");
const pin_service_1 = require("./pin/pin.service");
const pin_controller_1 = require("./pin/pin.controller");
const auth_module_1 = require("./auth/auth.module");
const mysql_module_1 = require("./mysql/mysql.module");
const auth_middleware_1 = require("./auth/auth-middleware/auth.middleware");
const user_controller_1 = require("./user/user.controller");
const user_service_1 = require("./user/user.service");
const log_module_1 = require("./log/log.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(auth_middleware_1.AuthMiddleware)
            .forRoutes(map_controller_1.MapController, pin_controller_1.PinController, user_controller_1.UserController, image_controller_1.ImageController);
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forRoot(), auth_module_1.AuthModule, mysql_module_1.MysqlModule, log_module_1.LogModule],
        controllers: [map_controller_1.MapController, image_controller_1.ImageController, pin_controller_1.PinController, user_controller_1.UserController],
        providers: [
            map_service_1.MapService,
            config_1.ConfigService,
            signal_service_1.SignalService,
            signal_gateway_1.SignalGateway,
            pin_service_1.PinService,
            user_service_1.UserService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map