import { join } from "path";
import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from "./prisma/prisma.service";
import { ServeStaticModule } from '@nestjs/serve-static';
import { FavoritesModule } from './favorites/favorites.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import {JwtMiddleware} from "./middleware/jwt.middleware";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      serveRoot: '/public',
    }),
    AuthModule,
    UsersModule,
    FavoritesModule,
    RestaurantsModule,
    RestaurantsModule
  ],
  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
