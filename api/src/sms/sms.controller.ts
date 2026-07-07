import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SmsService } from './sms.service';
import { SendSmsDto } from './dto/send-sms.dto';
import { UpdateSmsStatusDto } from './dto/update-sms-status.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { RequestUser } from 'src/common/types/tokens.type';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/response.decorator';

@ApiTags('sms')
@Controller('sms')
@UseGuards(JwtAuthGuard)
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('send')
  @ApiOperation({ summary: 'Отправить сообщение' })
  @ApiResponse({ status: 201, description: 'Сообщение отправлено успешно' })
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Сообщение отправлено успешно')
  async sendSms(
    @CurrentUser() user: RequestUser,
    @Body() sendSmsDto: SendSmsDto,
  ) {
    const userId = user.userId;
    return await this.smsService.sendSms(userId, sendSmsDto);
  }

  @Post('receive')
  @ApiOperation({ summary: 'Получить входящее сообщение' })
  @ApiResponse({ status: 201, description: 'Сообщение получено успешно' })
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Сообщение получено успешно')
  async receiveIncomingSms(
    @CurrentUser() user: RequestUser,
    @Body()
    body: {
      deviceId: string;
      simSlot: number;
      phoneNumber: string;
      text: string;
    },
  ) {
    const userId = user.userId;
    return await this.smsService.receiveIncomingSms(
      userId,
      body.deviceId,
      body.simSlot,
      body.phoneNumber,
      body.text,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Получить список сообщений пользователя' })
  @ApiResponse({ status: 200, description: 'Данные получены успешно' })
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Данные получены успешно')
  async getUserSms(
    @CurrentUser() user: RequestUser,
    @Query('limit') limit: string = '50',
    @Query('offset') offset: string = '0',
    @Query('type') type?: 'incoming' | 'outgoing',
    @Query('status') status?: string,
  ) {
    const userId = user.userId;
    return await this.smsService.getUserSms(
      userId,
      parseInt(limit),
      parseInt(offset),
      type,
      status,
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Получить статистику пользователя' })
  @ApiResponse({ status: 200, description: 'Данные получены успешно' })
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Данные получены успешно')
  async getSmsStats(@CurrentUser() user: RequestUser) {
    const userId = user.userId;
    return await this.smsService.getSmsStats(userId);
  }

  @Get(':messageId')
  @ApiOperation({ summary: 'Получить сообщение по его ID' })
  @ApiResponse({ status: 200, description: 'Данные получены успешно' })
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Данные получены успешно')
  async getSmsById(
    @CurrentUser() user: RequestUser,
    @Param('messageId') messageId: string,
  ) {
    const userId = user.userId;
    return await this.smsService.getSmsById(userId, messageId);
  }

  @Put(':messageId/status')
  @ApiOperation({ summary: 'Обновить сообщение' })
  @ApiResponse({ status: 201, description: 'Сообщение обновлено успешно' })
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Сообщение обновлено успешно')
  async updateSmsStatus(
    @CurrentUser() user: RequestUser,
    @Param('messageId') messageId: string,
    @Body() updateSmsStatusDto: UpdateSmsStatusDto,
  ) {
    const userId = user.userId;
    return await this.smsService.updateSmsStatus(
      userId,
      messageId,
      updateSmsStatusDto,
    );
  }
}
