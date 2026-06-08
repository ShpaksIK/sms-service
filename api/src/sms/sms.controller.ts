import { Body, Controller, Get, Post, UseGuards, UsePipes } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { SmsService } from './sms.service';
import { SendSmsDto } from './dto/send-sms.dto';
import { type RequestUser } from 'src/common/types/tokens.type';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { ValidationPipe } from 'src/common/validations/validation.pipe';

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('send')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Сообщение успешно доставлено')
  async sendSms(
    @Body(ValidationPipe) sendSmsDto: SendSmsDto,
    @CurrentUser() user: RequestUser,
  ) {
    const userId = user.userId;
    const result = await this.smsService.sendSms(
      sendSmsDto.phoneNumber,
      sendSmsDto.message,
      userId,
    );

    return {
      success: true,
      messageId: result.id,
      cost: result.cost,
      count: result.cnt,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserMessages(@CurrentUser() user: RequestUser) {
    const userId = user.userId;
    return await this.smsService.getUserMessages(userId);
  }
}
