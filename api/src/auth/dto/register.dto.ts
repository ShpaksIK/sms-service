import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'test@mail.ru',
    description: 'Email пользователя. Уникальный',
  })
  @IsEmail({}, { message: 'Некорректный email' })
  @MaxLength(255, { message: 'Длина email не должна превышать 255 символов' })
  email: string;

  @ApiProperty({
    example: '12345',
    description: 'Пароль пользователя',
  })
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(5, { message: 'Пароль должен содержать минимум 5 символов' })
  @MaxLength(255, { message: 'Пароль не должен превышать 255 символов' })
  password: string;

  @ApiProperty({
    example: 'Иван',
    description: 'Имя пользователя',
  })
  @IsString({ message: 'Имя должно быть строкой' })
  @MinLength(1, { message: 'Имя должно содержать минимум 1 символ' })
  @MaxLength(32, { message: 'Имя не должно превышать 32 символов' })
  firstName: string;
}
