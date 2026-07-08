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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { SimCard } from 'src/common/types/sim-card.type';

@ApiTags('device')
@Controller('device')
@UseGuards(JwtAuthGuard)
export class DeviceController {
  constructor(private readonly devicesService: DeviceService) {}

  @Post('register')
  @ApiOperation({ summary: 'Зарегистрировать устройство' })
  @ApiResponse({ status: 201, description: 'Устройство успешно добавлено' })
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Устройство успешно добавлено')
  @UseGuards(JwtAuthGuard)
  async registerDevice(
    @CurrentUser() user: RequestUser,
    @Body() createDeviceDto: CreateDeviceDto,
  ) {
    const userId = user.userId;
    return await this.devicesService.registerDevice(userId, createDeviceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список устройств пользователя' })
  @ApiResponse({ status: 200, description: 'Данные успешно получены' })
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Данные успешно получены')
  @UseGuards(JwtAuthGuard)
  async getUserDevices(@CurrentUser() user: RequestUser) {
    const userId = user.userId;
    return await this.devicesService.getUserDevices(userId);
  }

  @Get(':deviceId')
  @ApiOperation({ summary: 'Получить устройство по его ID' })
  @ApiResponse({ status: 200, description: 'Данные успешно получены' })
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Данные успешно получены')
  @UseGuards(JwtAuthGuard)
  async getDeviceById(
    @CurrentUser() user: RequestUser,
    @Param('deviceId') deviceId: string,
  ) {
    const userId = user.userId;
    return await this.devicesService.getDeviceById(userId, deviceId);
  }

  @Put(':deviceId/status')
  @ApiOperation({ summary: 'Обновить устройство' })
  @ApiResponse({ status: 201, description: 'Устройство успешно обновлено' })
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Устройство успешно обновлено')
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
  @ApiOperation({ summary: 'Удалить устройство' })
  @ApiResponse({ status: 204, description: 'Устройство успешно удалено' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ResponseMessage('Устройство успешно удалено')
  @UseGuards(JwtAuthGuard)
  async deleteDevice(
    @CurrentUser() user: RequestUser,
    @Param('deviceId') deviceId: string,
  ) {
    const userId = user.userId;
    return await this.devicesService.deleteDevice(userId, deviceId);
  }

  @Post(':deviceId/sim-cards/sync')
  @ApiOperation({ summary: 'Синхронизировать SIM карту с устройством' })
  @ApiResponse({ status: 204, description: 'Успешная синхронизация' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ResponseMessage('Успешная синхронизация')
  @UseGuards(JwtAuthGuard)
  async syncSimCards(
    @CurrentUser() user: RequestUser,
    @Param('deviceId') deviceId: string,
    @Body() body: { simCards: SimCard[] },
  ) {
    const userId = user.userId;
    return await this.devicesService.syncSimCards(
      userId,
      deviceId,
      body.simCards,
    );
  }
}
