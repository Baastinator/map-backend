import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './models/login.dto';
import { Request } from 'express';
import { TokenService } from './token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  @Post('login')
  public async login(@Body() body: LoginDTO): Promise<string> {
    if (!body.password)
      throw new HttpException('No password provided', HttpStatus.BAD_REQUEST);
    else if (!body.username)
      throw new HttpException('No username provided', HttpStatus.BAD_REQUEST);

    const token = await this.authService.login(body);

    if (token) return token;
    throw new HttpException('Login Data False', HttpStatus.UNAUTHORIZED);
  }

  @Post('register')
  public async register(
    @Body() body: LoginDTO,
    @Req() req: Request,
  ): Promise<void> {
    const user = this.tokenService.extractUserFromRequest(req);

    if (!user) throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);

    if (user.Admin !== 1)
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);

    if (!body.password)
      throw new HttpException('No password provided', HttpStatus.BAD_REQUEST);

    if (!body.username)
      throw new HttpException('No username provided', HttpStatus.BAD_REQUEST);

    if (await this.authService.exists(body.username))
      throw new HttpException('Username already used', HttpStatus.CONFLICT);

    await this.authService.register(body);
  }

  @Post('verify')
  public async verify(@Body() { token }: { token: string }): Promise<boolean> {
    if (!token)
      throw new HttpException('No token provided', HttpStatus.BAD_REQUEST);

    return await this.authService.verify(token);
  }
}
