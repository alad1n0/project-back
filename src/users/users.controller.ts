import {Body, Controller, Delete, Get, Param, Post, Req} from '@nestjs/common';
import { UsersService } from './users.service';
import {Request} from "express";
import {UpdateUserProfileDto} from "./dto/update-user-profile.dto";
import {UpdateUserPhoneDto} from "./dto/update-user-phone.dto";
import {UpdateUserAddressDto} from "./dto/update-user-address.dto";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('get-user-info')
  async getUserInfo(@Req() req: Request) {
    return this.usersService.getUsers(req);
  }

  @Post('update-user-profile')
  async updateUserProfile(
      @Req() req: Request,
      @Body() body: UpdateUserProfileDto
  ) {
    return this.usersService.updateUserProfile(req, body);
  }

  @Post('update-user-phone')
  async updateUserPhone(@Req() req: Request, @Body() body: UpdateUserPhoneDto) {
    return this.usersService.updateUserPhone(req, body);
  }

  @Post('create-user-address')
  async createUserAddress(@Req() req: Request, @Body() updateUserAddressDto: UpdateUserAddressDto) {
    return this.usersService.createUserAddress(req, updateUserAddressDto);
  }

  @Post('update-user-address/:id')
  async updateUserAddress(@Req() req: Request, @Param('id') id: string, @Body() updateUserAddressDto: UpdateUserAddressDto) {
    return this.usersService.updateUserAddress(req, String(id), updateUserAddressDto);
  }

  @Delete('delete-user-address/:id')
  async deleteUserAddress(@Req() req: Request, @Param('id') id: string) {
    return this.usersService.removeUserAddress(req, String(id));
  }
}
