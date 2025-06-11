import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
@HttpCode(HttpStatus.OK)
async login(
  @Body() loginDto: LoginDto,
  @Res({ passthrough: true }) response: Response,
) {
  const token = await this.authService.login(loginDto);

  response.cookie('auth_token', token.access_token, {
    httpOnly: true,
    secure: true, // SEMPRE true em produção
    sameSite: 'lax', // Alterado para cross-origin
    domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });

  return { 
    message: 'Login realizado com sucesso',
    user: token.user // Retorne também os dados do usuário
  };
}
  @UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  return {
    id: req.user.userId,
    email: req.user.email,
    name: req.user.name, // Adicione mais campos se necessário
    role: req.user.role,
  };
}

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Request() req, @Res({ passthrough: true }) response: Response) {
    const token = await this.authService.refreshToken(req.user.userId);

    response.cookie('auth_token', token.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return { message: 'Token renovado com sucesso' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
@HttpCode(HttpStatus.OK)
async logout(@Res({ passthrough: true }) response: Response) {
  response.clearCookie('auth_token', {
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined
  });
  return { message: 'Logout realizado com sucesso' };
}
}
