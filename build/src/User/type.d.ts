import { Request } from 'express';
export interface UserDTO {
    name: string;
    email: string;
    token: string;
}
export interface UserLoginDTO {
    email: string;
    password: string;
}
export interface UserSignupDTO extends UserLoginDTO {
    name: string;
}
export interface UserUpdateDTO {
    name: string;
}
export interface UserTokenBody {
    url: string;
    userId: string;
    scope: string;
}
export interface CustomRequest<T> extends Request {
    body: T;
}
