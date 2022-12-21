import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async findAll(): Promise<User[]> {
    return await this.find({});
  }

  public async findById(userId: number): Promise<User> {
    return await this.findOneBy({ id: userId });
  }

  public async createUser(dto: any): Promise<User> {
    const { name, email, password, role } = dto;
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = password;
    user.role = role;

    await this.save(user);
    return user;
  }

  public async editUser(userId: number, dto: any): Promise<User> {
    const { name, email, password, role } = dto;
    const user = await this.findOneBy({ id: userId });
    user.name = name;
    user.email = email;
    user.password = password;
    user.role = role;

    await this.save(user);

    return user;
  }

  public async changeStatus(userId: number, dto: any): Promise<User> {
    const { status } = dto;
    const user = await this.findOneBy({ id: userId });
    user.isActive = status;

    await this.save(user);

    return user;
  }
}
