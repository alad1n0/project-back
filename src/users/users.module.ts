import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {ResponseHelper} from "../helper/response.helper";
import {PrismaService} from "../prisma/prisma.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService, ResponseHelper, PrismaService],
})
export class UsersModule {}
