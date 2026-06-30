import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';

export class UpdateSmsStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['pending', 'queued', 'sent', 'delivered', 'failed', 'received'])
  status: string;

  @IsOptional()
  @IsString()
  external_id?: string;

  @IsOptional()
  @IsString()
  error_message?: string;
}
