import { applyDecorators, UseGuards } from '@nestjs/common';
import { TypeRole } from '../auth.interface';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { OwnerAuthGuard } from '../guards/owner.guard';

export const Auth = (role: TypeRole = 'admin') =>
  applyDecorators(
    role === 'owner' ? UseGuards(JwtAuthGuard, OwnerAuthGuard) : UseGuards(JwtAuthGuard)
  );
