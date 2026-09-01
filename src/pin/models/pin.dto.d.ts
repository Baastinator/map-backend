import { V2 } from '../../models/V2.interface';
import { PinModel } from './pin.model';
export interface PinDto {
    Name: string;
    ID: number;
    MapID: number;
    Pos: V2;
    Content: string;
}
export declare function toPinDto(model: PinModel): PinDto;
