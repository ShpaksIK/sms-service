import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DeviceService } from 'src/device/device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { RequestUser } from 'src/common/types/tokens.type';

@Controller('device')
@UseGuards(JwtAuthGuard)
export class DeviceController {
  constructor(private readonly devicesService: DeviceService) {}

  @Post('register')
  @UseGuards(JwtAuthGuard)
  async registerDevice(
    @CurrentUser() user: RequestUser,
    @Body() createDeviceDto: CreateDeviceDto,
  ) {
    const userId = user.userId;
    return await this.devicesService.registerDevice(userId, createDeviceDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserDevices(@CurrentUser() user: RequestUser) {
    const userId = user.userId;
    return await this.devicesService.getUserDevices(userId);
  }

  @Get(':deviceId')
  @UseGuards(JwtAuthGuard)
  async getDeviceById(
    @CurrentUser() user: RequestUser,
    @Param('deviceId') deviceId: string,
  ) {
    const userId = user.userId;
    return await this.devicesService.getDeviceById(userId, deviceId);
  }

  @Put(':deviceId/status')
  @UseGuards(JwtAuthGuard)
  async updateDeviceStatus(
    @CurrentUser() user: RequestUser,
    @Param('deviceId') deviceId: string,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ) {
    const userId = user.userId;
    return await this.devicesService.updateDeviceStatus(
      userId,
      deviceId,
      updateDeviceDto,
    );
  }

  @Delete(':deviceId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteDevice(
    @CurrentUser() user: RequestUser,
    @Param('deviceId') deviceId: string,
  ) {
    const userId = user.userId;
    return await this.devicesService.deleteDevice(userId, deviceId);
  }

  @Post(':deviceId/sim-cards/sync')
  @UseGuards(JwtAuthGuard)
  async syncSimCards(
    @CurrentUser() user: RequestUser,
    @Param('deviceId') deviceId: string,
    @Body() body: { simCards: any[] },
  ) {
    const userId = user.userId;
    return await this.devicesService.syncSimCards(
      userId,
      deviceId,
      body.simCards,
    );
  }
}
