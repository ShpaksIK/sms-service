import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  device_id: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  battery_level?: number;

  @IsOptional()
  @IsString()
  app_version?: string;
}
