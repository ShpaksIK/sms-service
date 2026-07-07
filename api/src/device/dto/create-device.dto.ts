import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateDeviceDto {
  @ApiProperty({
    example: 'Samsung Galaxy A55',
    description: 'Имя устройства',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '123abc456def789',
    description: 'Внутренний индентификатор устройства',
  })
  @IsString()
  @IsNotEmpty()
  device_id: string;

  @ApiProperty({
    example: 'SECRET_KEY',
    description: 'Секретный ключ для авторизации телефона в API',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

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
