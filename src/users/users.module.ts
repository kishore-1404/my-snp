import { Module } from '@nestjs/common';
import { UserResolver } from './resolvers/user.resolver';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersMapper } from './users.mapper';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UserResolver, UsersService, UsersMapper],
  exports: [UsersService, UsersMapper],
})
export class UsersModule {}
