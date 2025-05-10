import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {ResponseHelper} from "../helper/response.helper";
import {Request} from "express";
import {UpdateUserProfileDto} from "./dto/update-user-profile.dto";
import {UpdateUserPhoneDto} from "./dto/update-user-phone.dto";
import {UpdateUserAddressDto} from "./dto/update-user-address.dto";

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
                        addresses: {
                            select: {
                                id: true,
                                city: true,
                                locality: true,
                                street: true,
                                house: true,
                                flat: true,
                                floor: true,
                                apartment: true,
                                comment: true,
                                isMain: true,
                                type: true
                            }
                        }
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

    async createUserAddress(req: Request, updateUserAddressDto: UpdateUserAddressDto) {
        const userData = req['jwt_payload'];

        if (!userData || !userData.sub) {
            throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
        }

        const userProfile = await this.prisma.userProfile.findUnique({
            where: { userId: userData.sub }
        });

        if (!userProfile) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const address = {
            city: updateUserAddressDto.city,
            locality: updateUserAddressDto.locality,
            street: updateUserAddressDto.street,
            house: updateUserAddressDto.house,
            flat: updateUserAddressDto.flat,
            floor: updateUserAddressDto.floor,
            apartment: updateUserAddressDto.apartment,
            comment: updateUserAddressDto.comment,
            isMain: updateUserAddressDto.isMain,
            userProfileId: userProfile.id, // Correctly set the userProfileId from the database
            type: updateUserAddressDto.type,
        };

        const createdAddress = await this.prisma.address.create({
            data: address
        });

        console.log(createdAddress);

        return this.responseHelper.success({ address: createdAddress }, 'Address created successfully');
    }

    async updateUserAddress(req: Request, id: string, updateUserAddressDto: UpdateUserAddressDto) {
        const userData = req['jwt_payload'];

        if (!userData || !userData.sub) {
            throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
        }

        const userProfile = await this.prisma.userProfile.findUnique({
            where: { userId: userData.sub }
        });

        if (!userProfile) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const existingAddress = await this.prisma.address.findUnique({
            where: { id }
        });

        if (!existingAddress || existingAddress.userProfileId !== userProfile.id) {
            throw new HttpException('Access denied to this address', HttpStatus.FORBIDDEN);
        }

        const address = {
            city: updateUserAddressDto.city,
            locality: updateUserAddressDto.locality,
            street: updateUserAddressDto.street,
            house: updateUserAddressDto.house,
            flat: updateUserAddressDto.flat,
            floor: updateUserAddressDto.floor,
            apartment: updateUserAddressDto.apartment,
            comment: updateUserAddressDto.comment,
            type: updateUserAddressDto.type,
            isMain: updateUserAddressDto.isMain
        };

        const updatedAddress = await this.prisma.address.update({
            where: { id },
            data: address
        });

        return this.responseHelper.success({address: updatedAddress}, 'Address updated successfully');
    }

    async removeUserAddress(req: Request, id: string) {
        const userData = req['jwt_payload'];

        if (!userData || !userData.sub) {
            throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
        }

        const address = await this.prisma.address.findUnique({
            where: { id }
        });

        if (!address) {
            throw new HttpException('Address not found', HttpStatus.NOT_FOUND);
        }

        await this.prisma.address.delete({
            where: { id }
        });

        return this.responseHelper.success({address}, 'Address deleted successfully');
    }
}
