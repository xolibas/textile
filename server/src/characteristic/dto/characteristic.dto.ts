import { IsString } from 'class-validator';

export class CharacteristicDto {
  @IsString()
  name: string;
}
