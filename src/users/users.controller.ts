import {Body, Controller, Get, Post, Req} from '@nestjs/common';
import { UsersService } from './users.service';
import {Request} from "express";
import {UpdateUserProfileDto} from "./dto/update-user-profile.dto";
import {UpdateUserPhoneDto} from "./dto/update-user-phone.dto";

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

  @Post('update-user-address')
  async updateUserAddress(@Req() req: Request, @Body() address: string) {
    return this.usersService.updateUserAddress(req, address);
  }
}
