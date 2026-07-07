import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { type RequestUser } from 'src/common/types/tokens.type';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Получить данные своего профиля' })
  @ApiResponse({ status: 200, description: 'Данные успешно получены' })
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Данные успешно получены')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: RequestUser) {
    return await this.userService.getMe(user.userId);
  }

  @Patch()
  @ApiOperation({ summary: 'Обновить профиль' })
  @ApiResponse({ status: 204, description: 'Данные успешно обновлены' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ResponseMessage('Данные успешно обновлены')
  @UseGuards(JwtAuthGuard)
  async update(
    @CurrentUser() user: RequestUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(user.userId, updateUserDto);
  }

  @Delete()
  @ApiOperation({ summary: 'Удалить профиль' })
  @ApiResponse({ status: 204, description: 'Данные успешно удалены' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ResponseMessage('Данные успешно удалены')
  @UseGuards(JwtAuthGuard)
  async remove(@CurrentUser() user: RequestUser) {
    return await this.userService.remove(user.userId);
  }
}
