import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { PartialType } from 'nestjs-mapped-types';

class CreateUserDto {
  @ApiProperty({
    example: 'test@mail.ru',
    description: 'Email пользователя. Уникальный',
  })
  @IsEmail({}, { message: 'Некорректный email' })
  @MaxLength(255, { message: 'Длина email не должна превышать 255 символов' })
  email: string;

  @ApiProperty({
    example: 'Иван',
    description: 'Имя пользователя',
  })
  @IsString({ message: 'Имя должно быть строкой' })
  @MinLength(1, { message: 'Имя должно содержать минимум 1 символ' })
  @MaxLength(32, { message: 'Имя не должно превышать 32 символов' })
  firstName: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
