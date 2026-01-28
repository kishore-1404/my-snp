import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';


@Injectable()
export class NotificationsService {
    constructor(
        @InjectModel(Notification.name) private notificationModel: Model<Notification>
    ) {}
    
    async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
        const createdNotification = new this.notificationModel(createNotificationDto);
        return createdNotification.save();
    }
}
