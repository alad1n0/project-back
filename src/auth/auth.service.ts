import {ResponseHelper} from '../helper/response.helper';
import {PrismaService} from '../prisma/prisma.service';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {Role} from '@prisma/client';
import {addMinutes} from 'date-fns';
import {OauthDto} from './dto/oauth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private responseHelper: ResponseHelper
    ) {}

    async sendCode(phone: string) {
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const expiresAt = addMinutes(new Date(), 5);

        await this.prisma.otpCode.upsert({
            where: {phone},
            update: {code: otp, expiresAt},
            create: {phone, code: otp, expiresAt},
        });

        return this.responseHelper.success([], 'Code sent successfully');
    }

    async verifyOtp(phone: string, code: string) {
        const otpRecord = await this.prisma.otpCode.findUnique({where: {phone}});
        if (!otpRecord || otpRecord.code !== code || new Date() > otpRecord.expiresAt) {
            throw new UnauthorizedException('Invalid or expired OTP');
        }

        await this.prisma.otpCode.delete({where: {phone}});

        let user = await this.prisma.user.findUnique({where: {phone}});

        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    phone,
                    role: Role.USER,
                },
            });

            await this.prisma.userProfile.create({
                data: {
                    userId: user.id,
                },
            });
        }

        return this.generateTokens(user.id, user.role);
    }

    async oauthLogin(oauthDto: OauthDto) {
        let user = await this.prisma.user.findUnique({
            where: {providerId: oauthDto.providerId},
        });

        console.log(user);

        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email: oauthDto.email,
                    provider: oauthDto.provider,
                    providerId: oauthDto.providerId,
                    role: Role.USER,
                },
            });

            await this.prisma.userProfile.create({
                data: {
                    userId: user.id,
                },
            });
        }

        return this.generateTokens(user.id, user.role);
    }

    async adminLogin(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: {email},
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (user.role !== Role.ADMIN) {
            throw new UnauthorizedException('You are not an admin');
        }

        return this.generateTokens(user.id, user.role);
    }

    async refreshAccessToken(refreshToken: string) {
        console.log(refreshToken)

        const decoded = this.jwtService.verify(refreshToken);
        const userId = decoded.sub;

        const user = await this.prisma.user.findUnique({
            where: {id: userId}
        });

        if (!user) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const payload = {sub: user.id, role: user.role};
        const newAccessToken = this.jwtService.sign(payload, {expiresIn: '15m'});

        return this.responseHelper.success(
            {access_token: newAccessToken},
            'Access token refreshed successfully'
        );
    }

    private generateTokens(userId: string, role: string) {
        const payload = {sub: userId, role};
        const accessToken = this.jwtService.sign(payload, {expiresIn: '15m'});
        const refreshToken = this.jwtService.sign(payload, {expiresIn: '7d'});

        return this.responseHelper.success({
            access_token: accessToken,
            refresh_token: refreshToken
        }, 'Tokens generated successfully');
    }
}