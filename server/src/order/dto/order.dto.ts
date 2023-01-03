import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, Length, MaxLength, ValidateNested } from 'class-validator';
import { OrderProductDto } from './order-product.dto';

export class OrderDto {
  @Length(4, 100)
  @IsString()
  name: string;

  @Length(4, 100)
  @IsString()
  surname: string;

  fathername: string;

  email: string;

  phone: string;

  telegram: string;

  @IsString()
  deliverySlug: string;

  @Length(4, 100)
  @IsString()
  city: string;

  @Length(4, 100)
  @IsString()
  address: string;

  @IsString()
  paymentSlug: string;

  @MaxLength(65535)
  @IsString()
  comment: string;

  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  @IsNotEmpty()
  products: OrderProductDto[];
}
