import { Validate } from 'class-validator';
import { IsId } from 'src/validators/id.validator';

export class GetCharacteristicValuesDto {
  page = 1;

  limit = 20;

  @Validate(IsId)
  categoryId;
}
