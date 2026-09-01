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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinController = void 0;
const common_1 = require("@nestjs/common");
const pin_service_1 = require("./pin.service");
const token_service_1 = require("../auth/token.service");
const user_service_1 = require("../user/user.service");
let PinController = class PinController {
    constructor(pinService, tokenService, userService) {
        this.pinService = pinService;
        this.tokenService = tokenService;
        this.userService = userService;
    }
    async getAll(req) {
        const user = this.tokenService.extractUserFromRequest(req);
        if (!user)
            throw new common_1.HttpException('UNAUTHORIZED', common_1.HttpStatus.UNAUTHORIZED);
        return await this.pinService.getAll();
    }
    async getById({ id }, req) {
        const user = this.tokenService.extractUserFromRequest(req);
        if (!user)
            throw new common_1.HttpException('UNAUTHORIZED', common_1.HttpStatus.UNAUTHORIZED);
        if (!(+id > 0))
            throw new common_1.HttpException('ID needs to be a number', common_1.HttpStatus.BAD_REQUEST);
        return await this.pinService.getById(id);
    }
    async getByMapId({ id }, req) {
        const user = this.tokenService.extractUserFromRequest(req);
        if (!user)
            throw new common_1.HttpException('UNAUTHORIZED', common_1.HttpStatus.UNAUTHORIZED);
        if (!(+id > 0))
            throw new common_1.HttpException('ID needs to be a number', common_1.HttpStatus.BAD_REQUEST);
        return await this.pinService.getByMapId(id);
    }
    async createNewPin(body, req) {
        const user = this.tokenService.extractUserFromRequest(req);
        if (!user)
            throw new common_1.HttpException('UNAUTHORIZED', common_1.HttpStatus.UNAUTHORIZED);
        const isMapAdmin = await this.userService.isMapAdmin(body.mapId, user.ID);
        if (!isMapAdmin && !user.Admin)
            throw new common_1.HttpException('FORBIDDEN', common_1.HttpStatus.FORBIDDEN);
        if (!body.name)
            throw new common_1.HttpException('Name missing', common_1.HttpStatus.BAD_REQUEST);
        if (!body.mapId)
            throw new common_1.HttpException('Map ID missing', common_1.HttpStatus.BAD_REQUEST);
        if (!body.content)
            throw new common_1.HttpException('Content missing', common_1.HttpStatus.BAD_REQUEST);
        if (!body.y)
            throw new common_1.HttpException('Y coordinate missing', common_1.HttpStatus.BAD_REQUEST);
        if (!body.x)
            throw new common_1.HttpException('X coordinate missing', common_1.HttpStatus.BAD_REQUEST);
        return await this.pinService.createNew(body, user.ID);
    }
    async updatePinById(body, { id }, req) {
        const user = this.tokenService.extractUserFromRequest(req);
        if (!user)
            throw new common_1.HttpException('UNAUTHORIZED', common_1.HttpStatus.UNAUTHORIZED);
        const isMapAdmin = await this.pinService.isMapAdmin(id, user.ID);
        if (!isMapAdmin && !user.Admin)
            throw new common_1.HttpException('FORBIDDEN', common_1.HttpStatus.FORBIDDEN);
        if (!(+id > 0))
            throw new common_1.HttpException('ID needs to be a number', common_1.HttpStatus.BAD_REQUEST);
        const pin = await this.pinService.getById(id);
        if (body.content)
            pin.Content = body.content;
        if (body.name)
            pin.Name = body.name;
        await this.pinService.update(pin, user.ID);
    }
    async deletePinById({ id }, req) {
        const user = this.tokenService.extractUserFromRequest(req);
        if (!user)
            throw new common_1.HttpException('UNAUTHORIZED', common_1.HttpStatus.UNAUTHORIZED);
        const isMapAdmin = await this.pinService.isMapAdmin(id, user.ID);
        console.log('user.Admin', user.Admin);
        console.log('isMapAdmin', isMapAdmin);
        if (!isMapAdmin && !user.Admin)
            throw new common_1.HttpException('Lacking permissions to delete pin.', common_1.HttpStatus.FORBIDDEN);
        if (!(+id > 0))
            throw new common_1.HttpException('ID needs to be a number', common_1.HttpStatus.BAD_REQUEST);
        return await this.pinService.deleteById(id, user.ID);
    }
};
exports.PinController = PinController;
__decorate([
    (0, common_1.Get)(''),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PinController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PinController.prototype, "getById", null);
__decorate([
    (0, common_1.Get)('map/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PinController.prototype, "getByMapId", null);
__decorate([
    (0, common_1.Post)(''),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PinController.prototype, "createNewPin", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PinController.prototype, "updatePinById", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PinController.prototype, "deletePinById", null);
exports.PinController = PinController = __decorate([
    (0, common_1.Controller)('api/pins'),
    __metadata("design:paramtypes", [pin_service_1.PinService,
        token_service_1.TokenService,
        user_service_1.UserService])
], PinController);
//# sourceMappingURL=pin.controller.js.map