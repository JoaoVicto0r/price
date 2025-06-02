import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // Verificar se o email já existe
      const existingUser = await this.findByEmail(createUserDto.email);
      if (existingUser) {
        throw new ConflictException('Email já está em uso');
      }

      // Se a senha não estiver hasheada, fazer o hash
      let hashedPassword = createUserDto.password;
      if (!createUserDto.password.startsWith('$2b$')) {
        hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      }

      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
          role: createUserDto.role || 'USER',
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Erro ao criar usuário');
    }
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Usuário não encontrado');
    }
  }

  async findByEmail(email: string) {
    try {
      return await this.prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      return null;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      // Verificar se o usuário existe
      await this.findOne(id);

      // Se está atualizando o email, verificar se não está em uso
      if (updateUserDto.email) {
        const existingUser = await this.findByEmail(updateUserDto.email);
        if (existingUser && existingUser.id !== id) {
          throw new ConflictException('Email já está em uso');
        }
      }

      // Se está atualizando a senha, fazer o hash
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      const user = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Erro ao atualizar usuário');
    }
  }

  async remove(id: number) {
    try {
      // Verificar se o usuário existe
      await this.findOne(id);

      await this.prisma.user.delete({
        where: { id },
      });

      return { message: 'Usuário removido com sucesso' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Erro ao remover usuário');
    }
  }

  async changePassword(id: number, currentPassword: string, newPassword: string) {
    try {
      // Buscar usuário com senha
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      // Verificar senha atual
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error('Senha atual incorreta');
      }

      // Hash da nova senha
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Atualizar senha
      await this.prisma.user.update({
        where: { id },
        data: { password: hashedNewPassword },
      });

      return { message: 'Senha alterada com sucesso' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(error.message || 'Erro ao alterar senha');
    }
  }

  async getUserStats(userId: number) {
    try {
      const [recipesCount, ingredientsCount, suppliersCount] = await Promise.all([
        this.prisma.recipe.count({
          where: { userId, isActive: true },
        }),
        this.prisma.ingredient.count({
          where: { userId, isActive: true },
        }),
        this.prisma.supplier.count({
          where: { userId, isActive: true },
        }),
      ]);

      return {
        recipesCount,
        ingredientsCount,
        suppliersCount,
      };
    } catch (error) {
      throw new Error('Erro ao buscar estatísticas do usuário');
    }
  }
}