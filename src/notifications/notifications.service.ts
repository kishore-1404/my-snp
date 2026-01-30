import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { User } from 'src/users/schemas/user.schema';


@Injectable()
export class NotificationsService {
    constructor(
        @InjectModel(Notification.name) private notificationModel: Model<Notification>,
        @InjectModel(User.name) private userModel: Model<User>,
    ) {}

    async createNotification(createNotificationDto: CreateNotificationDto): Promise<Notification> {
        const user = await this.userModel.findById(createNotificationDto.recipientId).exec();
        if (!user) {
            throw new Error('User not found');
        }
        // If you want to check user preferences, add logic here
        const notification = new this.notificationModel({
            recipient: user,
            message: createNotificationDto.message,
            category: createNotificationDto.category,
        });
        return notification.save();
    }
}