export interface Order {
    _id: string;
    vinylIds: string[];
    qt: number;
    paymentId: string;
    isPaymentConfirmed: boolean;
    orderStatus: 'pending' | 'completed' | 'canceled';
    _createdAt: Date;
    _updatedAt: Date;
}