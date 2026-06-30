import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsIn,
} from 'class-validator';

export class UpdateDeviceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsIn(['online', 'offline'])
  status?: 'online' | 'offline';

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  battery_level?: number;

  @IsOptional()
  @IsString()
  app_version?: string;
}
