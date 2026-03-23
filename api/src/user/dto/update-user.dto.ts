import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PartialType } from 'nestjs-mapped-types';

class CreateUserDto {
  @IsEmail({}, { message: 'Некорректный email' })
  @MaxLength(255, { message: 'Длина email не должна превышать 255 символов' })
  email: string;

  @IsString({ message: 'Имя должно быть строкой' })
  @MinLength(1, { message: 'Имя должно содержать минимум 1 символ' })
  @MaxLength(32, { message: 'Имя не должно превышать 32 символов' })
  firstName: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
