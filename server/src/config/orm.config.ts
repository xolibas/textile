import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getConfigORM = async (
  configService: ConfigService
): Promise<TypeOrmModuleOptions> => ({
  type: 'postgres',
  port: configService.get('DB_PORT'),
  host: configService.get('DB_HOST'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  synchronize: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
});
