import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';

export class UpdateSmsStatusDto {
  @ApiProperty({
    example: 'pending',
    description: 'Статус отправки SMS',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['pending', 'queued', 'sent', 'delivered', 'failed', 'received'])
  status: string;

  @ApiProperty({
    description: 'Идентификатор сообщения в системе Android',
  })
  @IsOptional()
  @IsString()
  external_id?: string;

  @ApiProperty({
    description: 'Текст ошибки при статусе failed',
  })
  @IsOptional()
  @IsString()
  error_message?: string;
}
