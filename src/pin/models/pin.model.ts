import { PinDto } from './pin.dto';

export interface PinModel {
  ID: number;
  X: number;
  Y: number;
  Content: string;
  MapID: number;
}

export function toPinModel(model: PinDto): PinModel {
  return {
    Content: model.Content,
    MapID: model.MapID,
    ID: model.ID,
    X: model.Pos.x,
    Y: model.Pos.y,
  };
}
