import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'orderBy', async: false })
export class OrderBy implements ValidatorConstraintInterface {
  validate(orderBy) {
    switch (orderBy) {
      case 'name':
      case 'retailPrice':
      case 'updatedAt':
      case 'views':
        return true;
      default:
        return false;
    }
  }

  defaultMessage() {
    return `Order by "($value)" must be number, retailPrice, updatedAt or views`;
  }
}
