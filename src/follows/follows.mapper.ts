import { Injectable } from "@nestjs/common";
import { FollowType } from "./graphql/follow.type";
import { Follow } from "./schemas/follow.schema";
import { FollowerWithDetails, SuggestedUser } from "./graphql/aggregation.types";

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

toFollowerWithDetails(follow: any): FollowerWithDetails {
        const details = new FollowerWithDetails();
        details.followId = follow.followID?.toString?.() || follow.followId?.toString?.() || follow._id?.toString?.() || '';
        details.userId = follow.userId?.toString?.() || '';
        details.username = follow.username || '';
        details.isFollowingBack = Array.isArray(follow.isFollowingBack)
            ? follow.isFollowingBack.length > 0
            : !!follow.isFollowingBack;
        details.followedAt = follow.followedAt instanceof Date ? follow.followedAt : new Date(follow.followedAt);
        return details;
    }

    toSuggestedUser(suggestion: any): SuggestedUser {
        const user = new SuggestedUser();
        user.userId = suggestion.userId?.toString?.() || '';
        user.username = suggestion.username || '';
        user.commonConnections = suggestion.commonConnections || 0;
        user.connectedThrough = Array.isArray(suggestion.connectedThrough)
            ? suggestion.connectedThrough.map((u: any) => u?.toString?.() || u)
            : [];
        return user;
    }
}