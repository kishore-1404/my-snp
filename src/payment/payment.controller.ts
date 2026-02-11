import { Body, Controller, Post, Param, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/schemas/user.schema';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Post('create-order')
    async createOrder(@CurrentUser() user: User, @Body() createOrderDto: CreateOrderDto,) {
        const orderResponse = await this.paymentService.createOrder(createOrderDto, user);
        // return only order_id and payment_session_id
        return {
            order_id: orderResponse.order_id,
            payment_session_id: orderResponse.payment_session_id
        };
    }

    @Post('verify')
    async verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto) {
        return this.paymentService.verifyPayment(verifyPaymentDto.orderId);
    }

    @Public()
    @Get('status/:order_id')
    async getPaymentStatus(@Param('order_id') orderId: string) {
        const paymentStatus = await this.paymentService.verifyPayment(orderId);

        const payment = paymentStatus.payments && paymentStatus.payments.length > 0 ? paymentStatus.payments[0] : null;

        return {
            orderId: paymentStatus.order_id,
            status: payment ? payment.payment_status : paymentStatus.order_status,
            amount: payment ? payment.payment_amount : paymentStatus.order_amount
        }
    }
}
