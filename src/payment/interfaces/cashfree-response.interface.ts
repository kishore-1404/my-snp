
export interface OrderResponse {
    payment_session_id?: string;
    order_id?: string;
    cf_order_id?: string;
    order_status?: string;
    // Add other necessary fields based on SDK response
}
