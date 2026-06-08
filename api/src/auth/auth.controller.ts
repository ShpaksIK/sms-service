import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto, LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ValidationPipe } from 'src/common/validations/validation.pipe';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import type { Request, Response } from 'express';
import type { RequestUser } from 'src/common/types/tokens.type';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ResponseMessage('Успешная регистрация')
  async register(@Body(ValidationPipe) dto: RegisterDto) {
    await this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Успешный вход')
  async login(
    @Body(ValidationPipe) dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;

    const tokens = await this.authService.login(dto, userAgent, ip);

    this.setRefreshTokenCookie(res, tokens.refresh_token);

    return {
      access_token: tokens.access_token,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Успешный выход')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refresh_token'];

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    res.clearCookie('refresh_token');
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      throw new BadRequestException('Токен не предоставлен');
    }

    const tokens = await this.authService.refreshToken(refreshToken);

    this.setRefreshTokenCookie(res, tokens.refresh_token);

    return {
      access_token: tokens.access_token,
    };
  }

  @Post('changepassword')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Пароль изменен успешно')
  async changePassword(
    @Body(ValidationPipe) dto: ChangePasswordDto,
    @CurrentUser() user: RequestUser,
  ) {
    await this.authService.changePassword(dto, user.userId);
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
