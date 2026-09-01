import { MapService } from './map.service';
import { MapCreateDto } from './models/map-create.dto';
import { Identifiable } from '../models/id.interface';
import { Request } from 'express';
import { TokenService } from '../auth/token.service';
import { MapOwnerModel } from './models/map-owner.model';
import { UserService } from '../user/user.service';
export declare class MapController {
    private mapService;
    private tokenService;
    private userService;
    constructor(mapService: MapService, tokenService: TokenService, userService: UserService);
    getAll(req: Request): Promise<MapOwnerModel[]>;
    getById({ id }: Identifiable, req: Request): Promise<MapOwnerModel>;
    create(body: MapCreateDto, req: Request): Promise<void>;
    delete({ id }: Identifiable, req: Request): Promise<void>;
    uploadFile({ id }: Identifiable, image: {
        filename: string;
        originalname: string;
    }, req: Request): Promise<{
        url: string;
    }>;
}
