import { PinDto } from './pin.dto';
export interface PinModel {
    Name: string;
    ID: number;
    X: number;
    Y: number;
    Content: string;
    MapID: number;
}
export declare function toPinModel(model: PinDto): PinModel;
