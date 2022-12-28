import { IsNumber, IsString, Validate } from 'class-validator';
import { IsId } from 'src/validators/id.validator';

export class ProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  code: string;

  @Validate(IsId)
  categoryId: number;

  @IsNumber()
  wholesalePrice: number;

  @IsNumber()
  retailPrice: number;

  @Validate(IsId)
  size;

  @IsNumber()
  quantity: number;

  sizeValue;
}
