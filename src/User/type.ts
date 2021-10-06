import {Request} from 'express';

export interface UserDTO {
  name: string;
  email: string;
  token: string; // jwt token with id claim
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
  url: string; // The URL of your service
  userId: string; // The UID of the user in your system
  scope: string;
}

export interface CustomRequest<T> extends Request {
  body: T;
}
