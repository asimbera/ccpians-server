import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export default class User {
  @Field((type) => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  scope: string;
}
