export interface verifyEmailToken{
    _id: string;
    userId: string;
    token: string;
    expires_at: Date;
}