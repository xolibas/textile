import { IsString } from 'class-validator';

export class ImageDto {
  @IsString()
  alt: string;
}
