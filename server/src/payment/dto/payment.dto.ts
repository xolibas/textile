import { IsBoolean, IsString } from 'class-validator';

export class PaymentDto {
  @IsString()
  name: string;

  @IsBoolean()
  status: boolean;
}
