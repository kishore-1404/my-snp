import { Injectable } from "@nestjs/common";
import { User } from "./schemas/user.schema";
import { UserType } from "./graphql/user.type";

@Injectable()
export class UsersMapper {
  toUserType(user: User): UserType {
    const userType = new UserType();
    userType.id = user._id.toString();
    userType.username = user.username;
    userType.email = user.email;
    userType.bio = user.bio;
    userType.preferences = user.preferences;
    userType.roles = user.roles;
    userType.createdAt = user.createdAt;
    userType.updatedAt = user.updatedAt;
    return userType;
  }
}