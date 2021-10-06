import { UserDTO, UserLoginDTO, UserSignupDTO, UserUpdateDTO } from './type';
declare function getUserId(token?: string): string | null;
declare function signUp(user: UserSignupDTO): Promise<UserDTO>;
declare function logIn(userToLogIn: UserLoginDTO): Promise<FirebaseFirestore.DocumentData>;
declare function update(userNameObj: UserUpdateDTO, authToken?: string): Promise<FirebaseFirestore.DocumentData | undefined>;
declare const userModel: {
    logIn: typeof logIn;
    signUp: typeof signUp;
    update: typeof update;
    getUserId: typeof getUserId;
};
export default userModel;
