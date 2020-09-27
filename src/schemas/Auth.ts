import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class AuthPayload {
  @Field()
  token: string;
  @Field()
  uid: number;
  @Field()
  scope: string;
}
