import { Test, TestingModule } from '@nestjs/testing';
import { MapController } from './map.controller';
import { ConfigService } from '@nestjs/config';
import { MapService } from './map.service';
import { mock } from 'jest-mock-extended';

describe('MapController', () => {
  const setup = async (): Promise<{
    controller: MapController;
    mapService: MapService;
    configService: ConfigService;
  }> => {
    const mapService = mock<MapService>();
    const configService = mock<ConfigService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MapController],
      providers: [
        {
          provide: MapService,
          useValue: mapService,
        },
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    const controller = module.get<MapController>(MapController);

    return { controller, mapService, configService };
  };

  it('should be defined', async () => {
    const { controller } = await setup();

    expect(controller).toBeDefined();
  });
});
