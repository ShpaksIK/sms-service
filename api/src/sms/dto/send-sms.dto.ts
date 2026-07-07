import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  Matches,
  IsUUID,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';

export class SendSmsDto {
  @ApiProperty({
    example: '123abc456def789',
    description: 'Внутренний индентификатор устройства',
  })
  @IsUUID()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty({
    example: 1,
    description: 'Порядковый номер симки, через которую прошла транзакция',
  })
  @IsNumber()
  @Min(0)
  simSlot: number;

  @ApiProperty({
    example: '+71112223344',
    description: 'Номер получателя или отправителя',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[0-9]{10,15}$/, {
    message:
      'Номер телефона должен быть в международном формате (например, +79123456789 или 79123456789)',
  })
  phoneNumber: string;

  @ApiProperty({
    example: 'Hello world!',
    description: 'Текст сообщения',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(800)
  text: string;

  @ApiProperty({
    description: 'Время для отложенной отправки',
  })
  @IsOptional()
  @IsString()
  scheduledAt?: string;
}
