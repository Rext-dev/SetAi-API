import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class ToggleCommandDto {
  @IsString()
  commandName!: string;

  @IsBoolean()
  enabled!: boolean;

  @IsOptional()
  @IsString()
  serverId?: string;
}
