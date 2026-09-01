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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const token_service_1 = require("../auth/token.service");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    constructor(tokenService, userService) {
        this.tokenService = tokenService;
        this.userService = userService;
    }
    async getUsers(req) {
        const user = this.tokenService.extractUserFromRequest(req);
        if (!user)
            throw new common_1.HttpException('UNAUTHORIZED', common_1.HttpStatus.UNAUTHORIZED);
        return await this.userService.getAll();
    }
    async changePassword(body, req) {
        const user = this.tokenService.extractUserFromRequest(req);
        if (!user)
            throw new common_1.HttpException('UNAUTHORIZED', common_1.HttpStatus.UNAUTHORIZED);
        if (user.Admin !== 1)
            throw new common_1.HttpException('FORBIDDEN', common_1.HttpStatus.FORBIDDEN);
        if (!body.password)
            throw new common_1.HttpException('Password missing', common_1.HttpStatus.BAD_REQUEST);
        if (!body.username)
            throw new common_1.HttpException('Username missing', common_1.HttpStatus.BAD_REQUEST);
        await this.userService.changePassword(body, user.ID);
    }
    async getMapLinks({ mapId }, req) {
        const user = this.tokenService.extractUserFromRequest(req);
        if (!user)
            throw new common_1.HttpException('UNAUTHORIZED', common_1.HttpStatus.UNAUTHORIZED);
        const isMapAdmin = await this.userService.isMapAdmin(mapId, user.ID);
        if (!user.Admin && !isMapAdmin)
            throw new common_1.HttpException('FORBIDDEN', common_1.HttpStatus.FORBIDDEN);
        if (!(+mapId > 0))
            throw new common_1.HttpException('mapId needs to be a number', common_1.HttpStatus.BAD_REQUEST);
        return await this.userService.getUserLinks(mapId);
    }
    async addMapLink({ mapId, userId }, req) {
        const user = this.tokenService.extractUserFromRequest(req);
        if (!user)
            throw new common_1.HttpException('UNAUTHORIZED', common_1.HttpStatus.UNAUTHORIZED);
        const isMapAdmin = await this.userService.isMapAdmin(mapId, user.ID);
        if (!user.Admin && !isMapAdmin)
            throw new common_1.HttpException('FORBIDDEN', common_1.HttpStatus.FORBIDDEN);
        const error = this.validation(mapId, userId);
        if (error)
            throw error;
        await this.userService.setUserLink(mapId, userId, user.ID, true);
    }
    async removeMapLink({ mapId, userId }, req) {
        const user = this.tokenService.extractUserFromRequest(req);
        if (!user)
            throw new common_1.HttpException('UNAUTHORIZED', common_1.HttpStatus.UNAUTHORIZED);
        const isMapAdmin = await this.userService.isMapAdmin(mapId, user.ID);
        if (!user.Admin && !isMapAdmin)
            throw new common_1.HttpException('FORBIDDEN', common_1.HttpStatus.FORBIDDEN);
        let error = this.validation(mapId, userId);
        if (error)
            throw error;
        error = await this.userService.setUserLink(mapId, userId, user.ID, false);
        if (error)
            throw error;
    }
    async addMapLinkAdmin({ mapId, userId }, req) {
        const user = this.tokenService.extractUserFromRequest(req);
        if (!user)
            throw new common_1.HttpException('UNAUTHORIZED', common_1.HttpStatus.UNAUTHORIZED);
        const isMapAdmin = await this.userService.isMapAdmin(mapId, user.ID);
        if (!user.Admin && !isMapAdmin)
            throw new common_1.HttpException('FORBIDDEN', common_1.HttpStatus.FORBIDDEN);
        const error = this.validation(mapId, userId);
        if (error)
            throw error;
        await this.userService.setUserLinkAdmin(mapId, userId, user.ID, true);
    }
    async removeMapLinkAdmin({ mapId, userId }, req) {
        const user = this.tokenService.extractUserFromRequest(req);
        if (!user)
            throw new common_1.HttpException('UNAUTHORIZED', common_1.HttpStatus.UNAUTHORIZED);
        const isMapAdmin = await this.userService.isMapAdmin(mapId, user.ID);
        if (!user.Admin && !isMapAdmin)
            throw new common_1.HttpException('Not allowed.', common_1.HttpStatus.FORBIDDEN);
        const error = this.validation(mapId, userId);
        if (error)
            throw error;
        await this.userService.setUserLinkAdmin(mapId, userId, user.ID, false);
    }
    validation(mapId, userId) {
        if (!mapId)
            return new common_1.HttpException('mapId missing', common_1.HttpStatus.BAD_REQUEST);
        if (!userId)
            return new common_1.HttpException('userId missing', common_1.HttpStatus.BAD_REQUEST);
        if (!(+mapId > 0))
            return new common_1.HttpException('mapId needs to be a number', common_1.HttpStatus.BAD_REQUEST);
        if (!(+userId > 0))
            return new common_1.HttpException('userId needs to be a number', common_1.HttpStatus.BAD_REQUEST);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(''),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Post)('password/change'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Get)('links/:mapId'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getMapLinks", null);
__decorate([
    (0, common_1.Post)('links/add'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addMapLink", null);
__decorate([
    (0, common_1.Post)('links/remove'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "removeMapLink", null);
__decorate([
    (0, common_1.Post)('links/addAdmin'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addMapLinkAdmin", null);
__decorate([
    (0, common_1.Post)('links/removeAdmin'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "removeMapLinkAdmin", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('api/users'),
    __metadata("design:paramtypes", [token_service_1.TokenService,
        user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map