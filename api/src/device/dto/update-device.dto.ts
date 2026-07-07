import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsIn,
} from 'class-validator';

export class UpdateDeviceDto {
  @ApiProperty({
    example: 'Samsung Galaxy A55',
    description: 'Имя устройства',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'SECRET_KEY',
    description: 'Секретный ключ для авторизации телефона в API',
  })
  @IsOptional()
  @IsString()
  token?: string;

  @ApiProperty({
    example: 'online',
    description: 'Статус телефона (online, offline)',
  })
  @IsOptional()
  @IsIn(['online', 'offline'])
  status?: 'online' | 'offline';

  @ApiProperty({
    example: 67,
    description: 'Процент заряда телефона',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  battery_level?: number;

  @ApiProperty({
    example: '1.0.0',
    description: 'Версия приложения на устройстве',
  })
  @IsOptional()
  @IsString()
  app_version?: string;
}
