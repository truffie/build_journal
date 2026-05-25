import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { type Request, type Response } from 'express';
import { Public } from '../../shared/decorators/public.decorator';
import { REFRESH_TOKEN_COOKIE, REFRESH_TOKEN_MAX_AGE_MS } from './constants/auth.constants';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { AppConfigService } from '../../core/config/app-config.service';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly appConfig: AppConfigService,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  @Throttle({ short: { ttl: 60000, limit: 5 } })
  @ApiOperation({ summary: 'Вход (email + password)' })
  @ApiOkResponse({ type: LoginResponseDto })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const result = await this.authService.login(dto);
    this.setRefreshCookie(res, result.refreshToken);
    return { accessToken: result.accessToken, user: result.user };
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Обновить access token' })
  @ApiOkResponse({ type: LoginResponseDto })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE] as string | undefined;
    if (!refreshToken) {
      res.status(401).json({ message: 'No refresh token', statusCode: 401 });
      return undefined as unknown as LoginResponseDto;
    }
    const result = await this.authService.refresh(refreshToken);
    this.setRefreshCookie(res, result.refreshToken);
    return { accessToken: result.accessToken, user: result.user };
  }

  @Public()
  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Выход (очистка refresh cookie)' })
  logout(@Res({ passthrough: true }) res: Response): { message: string } {
    res.clearCookie(REFRESH_TOKEN_COOKIE, { httpOnly: true, path: '/api/auth' });
    return { message: 'Logged out' };
  }

  private setRefreshCookie(res: Response, token: string): void {
    res.cookie(REFRESH_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: this.appConfig.isProduction(),
      sameSite: 'strict',
      path: '/api/auth',
      maxAge: REFRESH_TOKEN_MAX_AGE_MS,
    });
  }
}
