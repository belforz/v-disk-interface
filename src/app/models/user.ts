export interface User{
    _id: string;
    name: string;
    email: string;
    password: string;
    roles: string[];
    emailVerified: boolean;
    _createdAt: Date;
    
}