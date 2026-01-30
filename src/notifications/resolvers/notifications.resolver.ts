import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { NotificationsService } from '../notifications.service';
import { Notification } from '../schemas/notification.schema';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';


const pubSub = new PubSub();


@Resolver(of => Notification)
export class NotificationsResolver {
  constructor(
    private readonly notificationsService:
    NotificationsService
  ) {}
  @Mutation(returns => Notification)
  async createNotification(
    @Args('createNotificationDto')
    createNotificationDto: CreateNotificationDto
  ) {
    const newNotification =
      await this.notificationsService.createNotification(
        createNotificationDto
      );
    pubSub.publish(
      'notificationAdded',
      { notificationAdded: newNotification }
    );
    return newNotification;
  }
  @Subscription(returns => Notification, {
    filter: (payload, variables) =>
      payload.notificationAdded.recipient._id.toString() ===
        variables.recipientId,
  })
  notificationAdded(@Args('recipientId') recipientId:
    string)
  {
    return pubSub.asyncIterableIterator('notificationAdded');
  }
}