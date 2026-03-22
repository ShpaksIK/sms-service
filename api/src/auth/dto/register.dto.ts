import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Некорректный email' })
  @MaxLength(255, { message: 'Длина email не должна превышать 255 символов' })
  email: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(5, { message: 'Пароль должен содержать минимум 5 символов' })
  @MaxLength(255, { message: 'Пароль не должен превышать 255 символов' })
  password: string;

  @IsString({ message: 'Имя должно быть строкой' })
  @MinLength(1, { message: 'Имя должно содержать минимум 1 символ' })
  @MaxLength(32, { message: 'Имя не должно превышать 32 символов' })
  firstName: string;
}
