import { LoginDTO } from '../auth/models/login.dto';
import { Request } from 'express';
import { TokenService } from '../auth/token.service';
import { UserService } from './user.service';
import { UserModel } from './models/user.model';
import { UserLinkModel } from './models/user-link.model';
import { LinkDto } from './models/link.dto';
export declare class UserController {
    private tokenService;
    private userService;
    constructor(tokenService: TokenService, userService: UserService);
    getUsers(req: Request): Promise<(Omit<UserModel, 'Passhash' | 'Admin' | 'AllowMapUpload'> & {
        Admin: boolean;
        AllowMapUpload: boolean;
    })[]>;
    changePassword(body: LoginDTO, req: Request): Promise<void>;
    getMapLinks({ mapId }: {
        mapId: number;
    }, req: Request): Promise<UserLinkModel>;
    addMapLink({ mapId, userId }: LinkDto, req: Request): Promise<void>;
    removeMapLink({ mapId, userId }: LinkDto, req: Request): Promise<void>;
    addMapLinkAdmin({ mapId, userId }: LinkDto, req: Request): Promise<void>;
    removeMapLinkAdmin({ mapId, userId }: LinkDto, req: Request): Promise<void>;
    private validation;
}
