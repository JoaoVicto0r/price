
import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { get } from 'axios';

@Controller()
export class AppController {
 @Get()
 getStatus(){
  return { status: 'API is up and running'};
  }
}
