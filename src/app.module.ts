import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import {ConfigModule} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {GraphQLModule} from "@nestjs/graphql";
import { ApolloDriver,ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { ReactionsModule } from './reactions/reactions.module';
// import { NotificationsService } from './notifications/notifications.service';
// import { NotificationsResolver } from './notifications/resolvers/notifications.resolver';
import { NotificationsModule } from './notifications/notifications.module';
import { AuthModule } from './auth/auth.module';

import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { registerEnumType } from '@nestjs/graphql';
import { Role } from './common/roles.enum';
// import { registerEnumType } from '@nestjs/graphql';
registerEnumType(Role, { name: 'Role' });
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      subscriptions: {
        'graphql-ws': true,
      },
      context: ({ req, res }) => ({ req, res })
      }),

    UsersModule,
    PostsModule,
    CommentsModule,
    ReactionsModule,
    NotificationsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
},
  ],
})
export class AppModule {}
