import { IsString, Validate } from 'class-validator';
import { IsId } from 'src/validators/id.validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @Validate(IsId)
  categoryId;
}
