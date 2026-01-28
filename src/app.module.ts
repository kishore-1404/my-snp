import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import {ConfigModule} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {GraphQLModule} from "@nestjs/graphql";
import { ApolloDriver,ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { ReactionsModule } from './reactions/reactions.module';
import { NotificationsService } from './notifications/notifications.service';
// import { NotificationsResolver } from './notifications/resolvers/notifications.resolver';
import { NotificationsResolver } from './notifications/resolvers/notifications.resolver';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      subscriptions: {
        'graphql-ws': {
          onConnect: (context) => {
            console.log('Client connected (graphql-ws)');
            // Handle Connection
          },
          onDisconnect: (context) => {
            console.log('Client disconnected (graphql-ws)');
            // Handle Disconnection
          }
        }
    }}),
    UsersModule,
    PostsModule,
    CommentsModule,
    ReactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService, NotificationsService, NotificationsResolver],
})
export class AppModule {}
