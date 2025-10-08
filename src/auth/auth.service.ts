import {ResponseHelper} from '../helper/response.helper';
import {PrismaService} from '../prisma/prisma.service';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {$Enums, Role} from '@prisma/client';
import {addMinutes} from 'date-fns';
import {OauthDto} from './dto/oauth.dto';
import * as bcrypt from 'bcryptjs';
import {OtpService} from "../service/otp/otp.service";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private otpService: OtpService,
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

        const sendOtpCode = await this.otpService.sendOtpCode(phone, otp);

        if (sendOtpCode) {
            return this.responseHelper.success(otp, 'Code sent successfully');
        } else {
            return this.responseHelper.error('Failed to send OTP code', 500);
        }
    }

    async verifyOtp(phone: string, code: string) {
        const otpRecord = await this.prisma.otpCode.findUnique({where: {phone}});
        if (!otpRecord || otpRecord.code !== code || new Date() > otpRecord.expiresAt) {
            throw new UnauthorizedException('Invalid or expired OTP');
        }

        await this.prisma.otpCode.delete({where: {phone}});

        let user = await this.prisma.user.findUnique({where: {phone}});
        let isNewUser = !user;

        if (isNewUser) {
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

        const userProfile = await this.prisma.userProfile.findUnique({
            where: {userId: user.id},
        });

        isNewUser = !(userProfile?.firstName && userProfile?.lastName);

        const tokens = this.generateTokens(user.id, user.role);

        return this.responseHelper.success({tokens, isNewUser}, 'OTP verified successfully');
    }

    async otpfinalize(phone: string, firstName: string, lastName: string) {
        await this.prisma.user.update({
            where: {phone: phone},
            data: {
                userProfile: {
                    update: {
                        firstName: firstName,
                        lastName: lastName,
                    }
                }
            },
        })

        return this.responseHelper.success([], 'Profile updated successfully');
    }

    async oauthLogin(oauthDto: OauthDto) {
        let user: { id: string; phone: string | null; createdAt: Date; email: string | null; password: string | null; provider: string | null; googleId: string | null; facebookId: string | null; role: $Enums.Role; };

        if (oauthDto.provider === "google") {
            user = await this.prisma.user.findUnique({
                where: { googleId: oauthDto.providerId },
            });
        } else if (oauthDto.provider === "facebook") {
            user = await this.prisma.user.findUnique({
                where: { facebookId: oauthDto.providerId },
            });
        }

        if (!user) {
            const dataToCreate: any = {
                email: oauthDto.email,
                role: Role.USER,
            };

            if (oauthDto.provider === "google") {
                dataToCreate.googleId = oauthDto.providerId;
            } else if (oauthDto.provider === "facebook") {
                dataToCreate.facebookId = oauthDto.providerId;
            }

            user = await this.prisma.user.create({
                data: dataToCreate,
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

        const tokens = this.generateTokens(user.id, user.role);

        return this.responseHelper.success({tokens}, 'Admin logged in successfully');
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

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }
}