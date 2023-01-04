import { genSalt, hash } from 'bcryptjs';
import { User } from 'src/user/user.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedOwnerUser1672874726489 implements MigrationInterface {
  name = 'SeedOwnerUser1672874726489';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const salt = await genSalt(10);

    const password = await hash('Tilo_098', salt);

    await queryRunner.manager.save(
      queryRunner.manager.create<User>(User, {
        name: 'Owner',
        email: 'textile.owner@gmail.com',
        role: 'owner',
        password: password,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM users`);
  }
}
