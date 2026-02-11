import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cashfree, CFEnvironment } from 'cashfree-pg';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponse } from './interfaces/cashfree-response.interface';
import { User } from 'src/users/schemas/user.schema';
import { Types, Model } from 'mongoose';
import { ulid } from 'ulid';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';

@Injectable()
export class PaymentService {
    private cashfree: Cashfree;
    private frontendUrl: string;

    constructor(
        private configService: ConfigService,
        @InjectModel(Order.name) private orderModel: Model<Order>
    ) {
        const XClientId: string = this.configService.getOrThrow<string>('cashfree.appId');
        const XClientSecret: string = this.configService.getOrThrow<string>('cashfree.secretKey');
        // const XEnvironment = this.configService.getOrThrow<string>('cashfree.environment');
        this.frontendUrl = this.configService.getOrThrow<string>('frontendUrl');

        this.cashfree = new Cashfree(
            CFEnvironment.SANDBOX,
            XClientId,
            XClientSecret
        );
    }


    async createOrder(createOrderDto: CreateOrderDto, user: User): Promise<OrderResponse> {
        const order_id = ulid();
        const request = {
            // Generate a unique order ID using ULID
            order_id: order_id,
            order_amount: createOrderDto.orderAmount,
            order_currency: createOrderDto.orderCurrency,
            customer_details: {
                customer_id: user._id.toString(),
                customer_phone: createOrderDto.customerPhone,
                customer_name: createOrderDto.customerName,
            },
            order_meta: {
                // Notify Url when webhook is enabled
                // notify_url: `http://localhost:3000/payment/notify`,
                // No retry policy for now
                // We point it to a simple success page or handle it on frontend
                return_url: `${this.frontendUrl}/payment-status?order_id=${order_id}`,
            }
        };

        // Create Order in DB first
        const newOrder = await this.orderModel.create({
            userId: user._id,
            orderId: request.order_id,
            amount: request.order_amount,
            currency: request.order_currency,
            customerPhone: request.customer_details.customer_phone,
            customerName: request.customer_details.customer_name,
            status: 'PENDING',
            paymentStatus: 'INITIATED'
        });

        try {
            const response = await this.cashfree.PGCreateOrder(request);

            // Update with CF Order ID if available
            if (response.data.cf_order_id) {
                newOrder.cfOrderId = response.data.cf_order_id;
                await newOrder.save();
            }

            return response.data;
        } catch (error) {
            // Mark as failed if API call fails
            newOrder.status = 'FAILED';
            newOrder.paymentStatus = 'API_ERROR';
            await newOrder.save();
            throw new InternalServerErrorException(error.message);
        }
    }

    async verifyPayment(orderId: string): Promise<any> {
        try {
            const response = await this.cashfree.PGFetchOrder(orderId);
            const orderData = response.data;

            // Update local order status
            await this.orderModel.findOneAndUpdate(
                { orderId: orderId },
                {
                    status: orderData.order_status,
                    paymentStatus: orderData.order_status
                }
            );

            return orderData;
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new NotFoundException(`Order with ID ${orderId} not found`);
            }
            throw new InternalServerErrorException(error.message);
        }
    }
}
