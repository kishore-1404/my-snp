import {
    Prop,
    Schema,
    SchemaFactory,
} from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { Role } from 'src/common/roles.enum';


@Schema()
@ObjectType()
export class User extends Document {
    @Field(() => ID)
    get id() {
        return this._id.toString();
    }
    
    @Prop({ required: true, unique: true })
    @Field()
    username: string;

    @Prop({ required: true, unique: true })
    @Field()
    email: string;

    @Prop({ required: true })
    // @Field()
    password: string;

    @Prop()
    @Field({ nullable: true })
    bio?: string;

    @Prop({type: Map, of:Boolean, default: {}})
    @Field(() => GraphQLJSON, { nullable: true })
    preferences: Record<string, boolean>;

    @Prop({ type: [String], default: ['user'] })
    @Field(() => [Role])
    roles: Role[];

    @Prop({ default: Date.now , immutable: true,required:true})
    @Field()
    createdAt: Date;
    

    @Prop({ default: Date.now , required:true})
    @Field()
    updateAt: Date;


}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set('timestamps', { createdAt: 'createdAt', updatedAt: 'updateAt' });