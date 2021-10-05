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
