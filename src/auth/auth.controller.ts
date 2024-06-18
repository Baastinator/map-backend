import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // userID: number, mapID?: number
  @Get()
  public async GetAdmin(): Promise<boolean> {
    const mapID = 7,
      userID = 1;

    return mapID
      ? await this.authService.getAdminStatusByMap(userID, mapID)
      : false;
  }
}
