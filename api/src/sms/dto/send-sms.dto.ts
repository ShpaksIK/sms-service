import { IsString, IsNotEmpty, MaxLength, Matches } from 'class-validator';

export class SendSmsDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[0-9]{10,15}$/, {
    message:
      'Номер телефона должен быть в международном формате (например, +79123456789 или 79123456789)',
  })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(800, { message: 'Сообщение не может превышать 800 символов' })
  message: string;
}
