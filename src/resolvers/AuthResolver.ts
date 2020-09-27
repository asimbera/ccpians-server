import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Arg, Mutation, Resolver } from 'type-graphql';
import AuthPayload from '../schemas/Auth';
import UserEntity from '../entities/User';
import { validateOrReject } from 'class-validator';
import { JWT_SECRET } from '../utils';
import { JWTPayload } from '../types';

@Resolver()
export default class {
  @Mutation((returns) => AuthPayload)
  async signup(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Arg('name') name: string
  ): Promise<AuthPayload> {
    // 1. hash password
    const hash = await bcrypt.hash(password, 10);

    // 2. add new user to database
    const new_user = UserEntity.create();
    new_user.name = name;
    new_user.email = email;
    new_user.password = hash;

    // validate before saving
    await validateOrReject(new_user);
    // save to database
    const user = await new_user.save();

    // 3. return token to client
    const payload: JWTPayload = { id: user.id, scope: user.scope };
    const token = jwt.sign(payload, JWT_SECRET);

    return {
      token,
      uid: user.id,
      scope: user.scope,
    };
  }

  @Mutation((returns) => AuthPayload)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<AuthPayload> {
    // 1. check if email is registered
    const user = await UserEntity.findOne({ where: { email } });

    if (!user) throw new Error('No user found');

    // 2. check if password matches
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) throw new Error('Invalid password');

    // 3. return token to client
    const payload: JWTPayload = { id: user.id, scope: user.scope };
    const token = jwt.sign(payload, JWT_SECRET);

    return {
      token,
      uid: user.id,
      scope: user.scope,
    };
  }
}
