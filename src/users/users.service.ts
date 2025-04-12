import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {ResponseHelper} from "../helper/response.helper";
import {Request} from "express";

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

    async updateUserProfile(req: Request, firstName: string, lastName: string) {
        const userData = req['jwt_payload'];

        if (!userData || !userData.sub) {
            throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
        }

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

    async updateUserPhone(req: Request, phone: string) {
        const userData = req['jwt_payload'];

        if (!userData || !userData.sub) {
            throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
        }

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
