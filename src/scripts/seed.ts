import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { PostsService } from '../posts/posts.service';
import { CommentsService } from '../comments/comments.service';
import { FollowsService } from '../follows/follows.service';
import { faker } from '@faker-js/faker';
import { CreateUserInput } from '../users/dto/create-user.input';
import { CreatePostDto } from '../posts/dto/create-post.dto';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { FollowUserDto } from '../follows/dto/create-follow.input';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const usersService = app.get(UsersService);
    const postsService = app.get(PostsService);
    const commentsService = app.get(CommentsService);
    const followsService = app.get(FollowsService);

    console.log('🌱 Starting seeding...');

    const USERS_COUNT = 50;
    const POSTS_PER_USER = 5;
    const COMMENTS_PER_POST = 3;

    const users: any[] = [];

    // 1. Create Users
    console.log(`Creating ${USERS_COUNT} users...`);
    for (let i = 0; i < USERS_COUNT; i++) {
        const userInput: CreateUserInput = {
            username: faker.internet.username() + Math.floor(Math.random() * 10000),
            email: faker.internet.email(),
            password: 'password123',
        };
        try {
            const user = await usersService.create(userInput);
            users.push(user);
        } catch (e) {
            // console.error(`Failed to create user ${userInput.username}:`, e.message);
        }
    }

    // 2. Create Posts
    console.log(`Creating posts...`);
    const allPosts: any[] = [];
    for (const user of users) {
        for (let i = 0; i < POSTS_PER_USER; i++) {
            const postInput: CreatePostDto = {
                content: faker.lorem.paragraph(),
            };
            try {
                const post = await postsService.create(postInput, user._id.toString());
                allPosts.push({ post, authorId: user._id.toString() });
            } catch (e) {
                //  console.error(`Failed to create post for user ${user.username}:`, e.message);
            }
        }
    }

    // 3. Create Comments
    console.log(`Creating comments...`);
    for (const { post } of allPosts) {
        const commenters = faker.helpers.arrayElements(users, COMMENTS_PER_POST);
        for (const commenter of commenters) {
            const commentInput: CreateCommentDto = {
                content: faker.lorem.sentence(),
                postId: post._id.toString(),
            };
            try {
                await commentsService.create(commentInput, commenter._id.toString());
            } catch (e) {
                //  console.error(`Failed to create comment:`, e.message);
            }
        }
    }

    // 4. Create Follows
    console.log(`Creating follows...`);
    for (const user of users) {
        const toFollow = faker.helpers.arrayElements(users, 5);
        for (const target of toFollow) {
            if (target._id.toString() === user._id.toString()) continue;

            const followInput: FollowUserDto = {
                followingId: target._id.toString(),
            };
            try {
                await followsService.followUser(followInput, user._id.toString());
            } catch (e) {
                // Ignore duplicate follows
            }
        }
    }

    console.log('✅ Seeding complete!');
    await app.close();
}

bootstrap();
