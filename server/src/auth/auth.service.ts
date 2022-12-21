import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { compare } from 'bcryptjs';

import { User } from '../user/user.entity';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Injectable()
export class AuthService extends TypeOrmCrudService<User> {
  constructor(@InjectRepository(User) repo, private readonly jwtService: JwtService) {
    super(repo);
  }

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);

    const tokens = await this.issueTokenPair(String(user.id));

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async getNewTokens({ refreshToken }: RefreshTokenDto) {
    if (!refreshToken) throw new UnauthorizedException('Sign in');

    const result = await this.jwtService.verifyAsync(refreshToken);
    if (!result) throw new UnauthorizedException('Invalid or expired token');

    const user = await this.repo.findOneBy({ id: result.id });

    const tokens = await this.issueTokenPair(String(user.id));

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async validateUser(dto: AuthDto): Promise<User> {
    const user = await this.repo.findOneBy({ email: dto.email });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isValidPassword = await compare(dto.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive');
    }

    return user;
  }

  async issueTokenPair(userId: string) {
    const data = { id: userId };

    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: '30d',
    });

    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: '1h',
    });

    return { refreshToken, accessToken };
  }

  returnUserFields(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
