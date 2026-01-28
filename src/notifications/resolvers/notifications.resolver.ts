import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { NotificationsService } from '../notifications.service';
import { Notification } from '../schemas/notification.schema';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { PubSub } from 'graphql-subscriptions';

const pubSub: any = new PubSub();

@Resolver(of => Notification)
export class NotificationsResolver {
    constructor(private readonly notificationsService: NotificationsService) {}
    
    @Mutation(() => Notification, { name: 'createnotification' })
    async createNotification(@Args('createNotificationDto') createNotificationDto: CreateNotificationDto): Promise<Notification> {
        const notification = await this.notificationsService.create(createNotificationDto);
        pubSub.publish('notificationCreated', { notificationCreated: notification });
        return notification;
    }

    @Subscription(returns => Notification,{
        filter: (payload, variables) => 
            payload.notificationCreated.recipientId === variables.recipientId,
    })
    notificationCreated(@Args('recipientId') recipientId: string) { 
        return pubSub.asyncIterator('notificationCreated');
    }
}