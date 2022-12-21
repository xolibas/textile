import { CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/user/user.entity';

export class OwnerAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<{ user: User }>();

    const user = request.user;

    if (user.role !== 'owner' || !user.isActive)
      throw new ForbiddenException('You have no rights to do this');

    return true;
  }
}
