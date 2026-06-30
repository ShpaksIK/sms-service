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
  @IsUUID()
  @IsNotEmpty()
  deviceId: string;

  @IsNumber()
  @Min(0)
  simSlot: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[0-9]{10,15}$/, {
    message:
      'Номер телефона должен быть в международном формате (например, +79123456789 или 79123456789)',
  })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(800)
  text: string;

  @IsOptional()
  @IsString()
  scheduledAt?: string;
}
