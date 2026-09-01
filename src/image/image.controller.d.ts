import { StreamableFile } from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from '../auth/token.service';
export declare class ImageController {
    private tokenService;
    constructor(tokenService: TokenService);
    getImage({ url }: {
        url: string;
    }, req: Request): Promise<StreamableFile>;
    uploadFile(image: {
        filename: string;
        originalname: string;
    }, req: Request): Promise<{
        url: string;
    }>;
}
