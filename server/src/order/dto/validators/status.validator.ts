import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'orderStatus', async: false })
export class OrderStatus implements ValidatorConstraintInterface {
  validate(status) {
    return status === 'created' || status === 'processing' || status === 'done';
  }

  defaultMessage() {
    return `Order status must be created, processing or done`;
  }
}
