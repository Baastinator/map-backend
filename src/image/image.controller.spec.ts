import { Test, TestingModule } from '@nestjs/testing';
import { ImageController } from './image.controller';

describe('ImageController', () => {
  const setup = async (): Promise<{
    controller: ImageController;
  }> => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageController],
    }).compile();

    const controller = module.get<ImageController>(ImageController);

    return { controller };
  };

  it('should be defined', async () => {
    const { controller } = await setup();

    expect(controller).toBeDefined();
  });
});
