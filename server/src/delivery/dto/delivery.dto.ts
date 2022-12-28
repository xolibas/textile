import { IsBoolean, IsString } from 'class-validator';

export class DeliveryDto {
  @IsString()
  name: string;

  @IsBoolean()
  status: boolean;
}
