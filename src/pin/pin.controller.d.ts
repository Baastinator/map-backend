import { PinDto } from './models/pin.dto';
import { PinService } from './pin.service';
import { Identifiable } from '../models/id.interface';
import { PinCreateDto } from './models/pin-create.dto';
import { Request } from 'express';
import { TokenService } from '../auth/token.service';
import { UserService } from '../user/user.service';
export declare class PinController {
    private pinService;
    private tokenService;
    private userService;
    constructor(pinService: PinService, tokenService: TokenService, userService: UserService);
    getAll(req: Request): Promise<PinDto[]>;
    getById({ id }: Identifiable, req: Request): Promise<PinDto>;
    getByMapId({ id }: Identifiable, req: Request): Promise<PinDto[]>;
    createNewPin(body: PinCreateDto, req: Request): Promise<void>;
    updatePinById(body: Partial<PinCreateDto>, { id }: Identifiable, req: Request): Promise<void>;
    deletePinById({ id }: Identifiable, req: Request): Promise<void>;
}
