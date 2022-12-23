import { IsString } from 'class-validator';

export class EditCategoryDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  slug: string;

  @IsString()
  fileUrl: string;

  categoryId;
}
