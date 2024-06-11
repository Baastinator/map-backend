import { V2 } from '../../models/V2.interface';
import { PinModel } from './pin.model';

export interface PinDto {
  Name: string;
  ID: number;
  MapID: number;
  Pos: V2;
  Content: string;
}

export function toPinDto(model: PinModel): PinDto {
  return {
    Name: model.Name,
    Content: model.Content,
    Pos: {
      x: model.X,
      y: model.Y,
    },
    MapID: model.MapID,
    ID: model.ID,
  };
}
