import { IsString, Validate } from 'class-validator';
import { IsId } from 'src/validators/id.validator';

export class EditCategoryDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  slug: string;

  @Validate(IsId)
  categoryId;
}
