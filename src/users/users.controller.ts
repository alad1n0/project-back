import {Body, Controller, Get, Post, Req} from '@nestjs/common';
import { UsersService } from './users.service';
import {Request} from "express";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('get-user-info')
  async getUserInfo(@Req() req: Request) {
    return this.usersService.getUsers(req);
  }

  @Post('update-user-profile')
  async updateUserProfile(@Req() req: Request, @Body() firstName: string, @Body() lastName: string) {
    return this.usersService.updateUserProfile(req, firstName, lastName);
  }

  @Post('update-user-phone')
  async updateUserPhone(@Req() req: Request, @Body() phone: string) {
    return this.usersService.updateUserPhone(req, phone);
  }

  @Post('update-user-address')
  async updateUserAddress(@Req() req: Request, @Body() address: string) {
    return this.usersService.updateUserAddress(req, address);
  }
}
