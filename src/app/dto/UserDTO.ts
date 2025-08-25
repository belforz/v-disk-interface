import { User } from "../models/user";

export interface ICreateUserDTO extends User{

}
export interface IUpdateUserDTO extends Partial<User>{

}
export interface UserResponse extends User {
    emailVerified: boolean;
}