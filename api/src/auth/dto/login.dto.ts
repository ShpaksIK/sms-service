import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
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
}

export class ChangePasswordDto {
  @ApiProperty({
    example: '123456',
    description: 'Новый пароль пользователя',
  })
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(5, { message: 'Пароль должен содержать минимум 5 символов' })
  @MaxLength(255, { message: 'Пароль не должен превышать 255 символов' })
  newPassword: string;

  @ApiProperty({
    example: '12345',
    description: 'Старый (текущий) пароль пользователя',
  })
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(5, { message: 'Пароль должен содержать минимум 5 символов' })
  @MaxLength(255, { message: 'Пароль не должен превышать 255 символов' })
  currentPassword: string;
}
