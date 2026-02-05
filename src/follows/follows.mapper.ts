import { Injectable } from "@nestjs/common";
import { FollowType } from "./graphql/follow.type";
import { Follow } from "./schemas/follow.schema";

@Injectable()
export class FollowsMapper {
    toFollowType(follow: Follow): FollowType {
        const followType = new FollowType();
        followType.id = follow._id.toString();
        followType.follower = follow.follower as any; // Assuming population is handled
        followType.following = follow.following as any; // Assuming population is handled
        followType.createdAt = follow.createdAt;
        followType.updatedAt = follow.updatedAt;
        return followType;
    }
}