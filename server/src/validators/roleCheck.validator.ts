import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'roleCheck', async: false })
export class RoleCheck implements ValidatorConstraintInterface {
  validate(role: string) {
    return role === 'owner' || role === 'admin';
  }

  defaultMessage() {
    return `User with role "($value)" can't be added. Available roles: owner and user`;
  }
}
