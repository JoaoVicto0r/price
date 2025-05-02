import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor (private prisma: PrismaService){}


  async create(createUserDto: CreateUserDto) {
   const existingUser = await this.prisma.user.findUnique({
    where: {email: createUserDto.email}
   });

   if (existingUser) {

    throw new Error('E-mail já cadastrado');
   }

   const user = await this.prisma.user.create({

    data: createUserDto,
   });

    
    return user;

  }



  async findAll() {
    return await this.prisma.user.findMany();
  }



  async findOne(id: number) {
    return await this.prisma.user.findUnique({
      where: {id},
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {id}
    });

    if (!existingUser) {
      throw new Error ('Usuario não existe');
    }

     return await this.prisma.user.update({
       where: {id},
       data: updateUserDto,
    });
  }

  async remove(id: number) {
    const existingUser = await this.prisma.user.findUnique({
      where: {id},
    });

    if (!existingUser) {
      throw new Error ('Usuario Inexistente');
    }

    return await this.prisma.user.delete({
      where:{id},
    });
  }
}
