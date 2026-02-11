import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import configuration from './config/configuration';
import { validate } from './config/env.validation';
import { AppController } from './app.controller';
import { AppService } from './app.service';


import { MongooseModule } from "@nestjs/mongoose";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
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

import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { registerEnumType } from '@nestjs/graphql';
import { Role } from './common/roles.enum';
// import { registerEnumType } from '@nestjs/graphql';
import { FollowsModule } from './follows/follows.module';
import { PaymentModule } from './payment/payment.module';
registerEnumType(Role, { name: 'Role' });
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
    }),
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

    LoggerModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV !== 'production'
          ? {
            target: 'pino-pretty',
            options: {
              singleLine: true,
            },
          }
          : undefined,
        redact: {
          paths: ['req.headers.authorization', 'req.body.password'],
          censor: '***',
        },
      },
    }),
    UsersModule,
    PostsModule,
    CommentsModule,
    // ReactionsModule,
    NotificationsModule,
    AuthModule,
    FollowsModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    }
  ],
})
export class AppModule { }
