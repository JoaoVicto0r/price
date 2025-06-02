import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { Request } from 'express';

const cookieExtractor = (req: Request): string | null => {
  if (req && req.cookies) {
    return req.cookies['auth_token'] || null; // Nome do cookie deve bater com o que você usa
  }
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {
    const options: StrategyOptionsWithRequest = {
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || '47e19f2ecfac91cc842a78c9fc7e9d5220b875410d6ceab74f8eacfb2842b7edde696c77de8cede2a06dd6acf5f47370d63dd8ab8506ef18b6f8b70d9280e2a4',
      passReqToCallback: true,
    };
    super(options);
  }

  // Como passReqToCallback é true, o validate recebe o req primeiro
  async validate(req: Request, payload: any) {
    const user = await this.userService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role || 'USER',
    };
  }
}
