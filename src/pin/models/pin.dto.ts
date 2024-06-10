import { V2 } from '../../models/V2.interface';
import { PinModel } from './pin.model';

export interface PinDto {
  ID: number;
  MapID: number;
  Pos: V2;
  Content: string;
}

export function toPinDto(model: PinModel): PinDto {
  return {
    Content: model.Content,
    Pos: {
      x: model.X,
      y: model.Y,
    },
    MapID: model.MapID,
    ID: model.ID,
  };
}
