import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { type RequestUser } from 'src/common/types/tokens.type';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Данные успешно получены')
  async getMe(@CurrentUser() user: RequestUser) {
    return await this.userService.getMe(user.userId);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Данные успешно обновлены')
  async update(
    @CurrentUser() user: RequestUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(user.userId, updateUserDto);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Данные успешно удалены')
  async remove(@CurrentUser() user: RequestUser) {
    return await this.userService.remove(user.userId);
  }
}
