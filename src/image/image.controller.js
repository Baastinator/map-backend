"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageController = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const fs = __importStar(require("fs"));
const platform_express_1 = require("@nestjs/platform-express");
const token_service_1 = require("../auth/token.service");
let ImageController = class ImageController {
    constructor(tokenService) {
        this.tokenService = tokenService;
    }
    async getImage({ url }, req) {
        const user = this.tokenService.extractUserFromRequest(req);
        if (!user)
            throw new common_1.HttpException('UNAUTHORIZED', common_1.HttpStatus.UNAUTHORIZED);
        if (!url)
            throw new common_1.HttpException('Url missing', common_1.HttpStatus.BAD_REQUEST);
        const path = (0, path_1.join)(process.cwd(), 'uploads', url);
        if (!fs.existsSync(path))
            throw new common_1.HttpException('Not found', 404);
        return new common_1.StreamableFile(fs.createReadStream(path));
    }
    async uploadFile(image, req) {
        const user = this.tokenService.extractUserFromRequest(req);
        if (!user)
            throw new common_1.HttpException('UNAUTHORIZED', common_1.HttpStatus.UNAUTHORIZED);
        const type = '.' + image.originalname.split('.').slice(-1);
        fs.rename((0, path_1.join)('uploads', image.filename), (0, path_1.join)('uploads', image.filename + type), () => void 0);
        const imageUrl = image.filename + type;
        return { url: imageUrl };
    }
};
exports.ImageController = ImageController;
__decorate([
    (0, common_1.Get)(':url'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "getImage", null);
__decorate([
    (0, common_1.Post)(''),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', { dest: './uploads' })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "uploadFile", null);
exports.ImageController = ImageController = __decorate([
    (0, common_1.Controller)('api/images'),
    __metadata("design:paramtypes", [token_service_1.TokenService])
], ImageController);
//# sourceMappingURL=image.controller.js.map