import { Validate } from 'class-validator';
import { OrderStatus } from './validators/status.validator';

export class ChangeStatusDto {
  @Validate(OrderStatus)
  status: string;
}
