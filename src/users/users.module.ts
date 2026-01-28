import { Module } from '@nestjs/common';
import { UserResolver } from './resolvers/user.resolver';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UserResolver, UsersService]
})
export class UsersModule {}
