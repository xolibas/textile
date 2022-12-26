import { IsNumber, IsString } from 'class-validator';

export class CharacteristicValueDto {
  @IsString()
  name: string;

  @IsNumber()
  characteristicId: number;
}
