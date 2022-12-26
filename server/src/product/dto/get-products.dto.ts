import { Validate } from 'class-validator';
import { OrderBy } from './validators/order-by.validator';
import { OrderType } from './validators/order-type.validator';

export class GetProductsDto {
  page = 1;

  limit = 20;

  @Validate(OrderBy)
  orderBy = 'retailPrice';

  @Validate(OrderType)
  orderType = 'asc';

  categorySlug;
}
