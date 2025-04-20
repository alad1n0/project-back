import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {ResponseHelper} from "../helper/response.helper";
import {Request} from "express";
import {UpdateUserProfileDto} from "./dto/update-user-profile.dto";
import {UpdateUserPhoneDto} from "./dto/update-user-phone.dto";

@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly responseHelper: ResponseHelper
    ) {}

    async getUsers(req: Request) {
        const userData = req['jwt_payload'];

        if (!userData || !userData.sub) {
            throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
        }

        const users = await this.prisma.user.findUnique({
            where: {id: userData.sub},
            select: {
                id: true,
                phone: true,
                role: true,
                userProfile: {
                    select: {
                        firstName: true,
                        lastName: true,
                        address: true
                    }
                }
            }
        });

        return this.responseHelper.success(users, 'Users fetched successfully');
    }

    async updateUserProfile(req: Request, body: UpdateUserProfileDto) {
        const userData = req['jwt_payload'];

        if (!userData || !userData.sub) {
            throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
        }

        const { firstName, lastName } = body;

        await this.prisma.user.update({
            where: {id: userData.sub},
            data: {
                userProfile: {
                    update: {
                        firstName: firstName,
                        lastName: lastName,
                    }
                }
            }
        });

        return this.responseHelper.success([], 'Profile updated successfully');
    }

    async updateUserPhone(req: Request, body: UpdateUserPhoneDto) {
        const userData = req['jwt_payload'];

        if (!userData || !userData.sub) {
            throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
        }

        const { phone, otp } = body;

        const otpRecord = await this.prisma.otpCode.findUnique({where: {phone}});

        if (!otpRecord || otpRecord.code !== otp || new Date() > otpRecord.expiresAt) {
            throw new UnauthorizedException('Invalid or expired OTP');
        }

        await this.prisma.otpCode.delete({where: {phone}});

        await this.prisma.user.update({
            where: {id: userData.sub},
            data: {phone: phone}
        });

        return this.responseHelper.success([], 'Phone number updated successfully');
    }

    async updateUserAddress(req: Request, address: string) {
        const userData = req['jwt_payload'];

        if (!userData || !userData.sub) {
            throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
        }

        await this.prisma.user.update({
            where: {id: userData.sub},
            data: {
                userProfile: {
                    update: {
                        address: address
                    }
                }
            }
        });

        return this.responseHelper.success([], 'Address updated successfully');
    }
}
