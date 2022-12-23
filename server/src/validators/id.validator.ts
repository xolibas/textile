import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isId', async: false })
export class IsId implements ValidatorConstraintInterface {
  validate(id) {
    return !id || typeof id === 'number';
  }

  defaultMessage() {
    return `Category Id "($value)" is not null and is not number`;
  }
}
