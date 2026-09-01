import { MapModel } from './map.model';

export type MapOwnerModel = MapModel & {
  owners: number[];
};
