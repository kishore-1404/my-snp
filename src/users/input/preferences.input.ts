import { InputType, Field } from '@nestjs/graphql';
import {GraphQLJSON} from 'graphql-type-json';

@InputType()
export class PreferencesInput {
  @Field(() => [String])
  keys: string[];

  @Field(() => [Boolean])
  values: boolean[];
}
