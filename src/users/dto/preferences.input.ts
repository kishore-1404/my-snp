import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class PreferencesInput {
  @Field(() => [String])
  keys: string[];

  @Field(() => [Boolean])
  values: boolean[];
}
