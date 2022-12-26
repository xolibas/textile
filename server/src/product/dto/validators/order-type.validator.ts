import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'orderType', async: false })
export class OrderType implements ValidatorConstraintInterface {
  validate(orderType) {
    return orderType === 'asc' || orderType === 'desc';
  }

  defaultMessage() {
    return `Order type "($value)" must be asc or desc`;
  }
}
