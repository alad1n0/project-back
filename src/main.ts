import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

(async () => {

    const app = await NestFactory.create(AppModule);

    // app.use((req, res, next) => {
    //   res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    //   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    //   res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type, Accept');
    //   res.header('Access-Control-Allow-Credentials', 'true');
    //
    //   if (req.method === 'OPTIONS') {
    //     return res.sendStatus(204);
    //   }
    //
    //   next();
    // });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        })
    );

    app.enableCors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Authorization', 'Content-Type', 'Accept'],
    });

    app.setGlobalPrefix('api');

    const port = process.env.PORT || 3000;
    await app.listen(port);

    console.log(`🚀 Server is running on http://localhost:${port}`);

})();