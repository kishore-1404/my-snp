import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/common/roles.enum';
import { Types } from 'mongoose';
@Schema()
export class User extends Document {
    get_id() {
        return this._id.toString();
    }

    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    bio?: string;

    @Prop({ type: Map, of: Boolean, default: {} })
    preferences: Record<string, boolean>;

    @Prop({ type: [String], default: ['user'] })
    roles: Role[];

    @Prop({ default: Date.now, immutable: true, required: true })
    createdAt: Date;

    @Prop({ default: Date.now, required: true })
    updateAt: Date;
}


export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('timestamps', { createdAt: 'createdAt', updatedAt: 'updateAt' });