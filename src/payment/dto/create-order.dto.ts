import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateOrderDto {
    @IsNumber()
    @Min(1)
    orderAmount: number;

    @IsString()
    @IsNotEmpty()
    orderCurrency: string = 'INR';

    @IsString()
    @IsNotEmpty()
    customerId: string;

    @IsString()
    @IsNotEmpty()
    customerPhone: string;

    @IsString()
    @IsOptional()
    customerName?: string;
}
