import { Arg, Authorized, Query, Resolver } from 'type-graphql';

import User from '../schemas/User';
import UserEntity from '../entities/User';

@Resolver()
export default class UserResolver {
  @Authorized('admin')
  @Query((returns) => [User])
  async fetchUsers(): Promise<User[]> {
    const users = await UserEntity.find();
    return users;
  }

  @Authorized('admin')
  @Query((returns) => User, { nullable: true })
  async getUser(@Arg('id') id: number): Promise<User | undefined> {
    const user = await UserEntity.findOne({ where: { id } });
    return user;
  }
}
