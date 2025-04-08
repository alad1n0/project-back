import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    constructor(private jwtService: JwtService) {}

    use(req: Request, res: Response, next: NextFunction) {
        const bearerToken = req.headers['authorization']?.split(' ')[1];

        if (!bearerToken) {
            console.log('No token');
            return next();
        }

        try {
            req['jwt_payload'] = this.jwtService.verify(bearerToken);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                console.log('Token expired');
                throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
            } else {
                console.log('Invalid token');
                throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
            }
        }

        next();
    }
}