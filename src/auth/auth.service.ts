import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
  const user = await this.validateUser(loginDto.email, loginDto.password);
  if (!user) {
    throw new UnauthorizedException('Credenciais inválidas');
  }

  const payload = {
    email: user.email,
    sub: user.id,
    role: user.role || 'USER',
  };

  const access_token = this.jwtService.sign(payload);

  return {
    access_token,
    user: {  // Adicione os dados do usuário que você precisa
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  };
}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('Email já está em uso');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // Login automático após registro
    return this.login({ email: user.email, password: createUserDto.password });
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }
      return user;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }

  async refreshToken(userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role || 'USER',
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
    };
  }
}
