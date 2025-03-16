import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import {PrismaService} from "./prisma/prisma.service";
import { RestaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [UsersModule, AuthModule,RestaurantsModule],
  providers: [PrismaService],
})
export class AppModule {}
