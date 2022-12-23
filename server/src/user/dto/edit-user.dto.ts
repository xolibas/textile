import { IsEmail, IsString, Length, MinLength, Validate } from 'class-validator';
import { RoleCheck } from '../../validators/role-check.validator';

export class EditUserDto {
  @IsEmail()
  email?: string;

  @MinLength(6, {
    message: 'Password cannot be less than 6 characters',
  })
  @IsString()
  password?: string;

  @Length(4, 100)
  @IsString()
  name?: string;

  @Validate(RoleCheck)
  role?: string;
}
