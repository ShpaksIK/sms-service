import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Некорректный email' })
  @MaxLength(255, { message: 'Длина email не должна превышать 255 символов' })
  email: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(5, { message: 'Пароль должен содержать минимум 5 символов' })
  @MaxLength(255, { message: 'Пароль не должен превышать 255 символов' })
  password: string;
}

export class ChangePasswordDto {
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(5, { message: 'Пароль должен содержать минимум 5 символов' })
  @MaxLength(255, { message: 'Пароль не должен превышать 255 символов' })
  newPassword: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(5, { message: 'Пароль должен содержать минимум 5 символов' })
  @MaxLength(255, { message: 'Пароль не должен превышать 255 символов' })
  currentPassword: string;
}
