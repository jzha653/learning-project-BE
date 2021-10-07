import DB from '../lib/database';
import {
  UserDTO,
  UserLoginDTO,
  UserSignupDTO,
  UserUpdateDTO,
  UserWithPassword,
} from './type';
import jwt from 'jsonwebtoken';
import passwordHash from 'password-hash';
import {APIError} from '../lib/api-error';

const userRef = DB.collection('users');
const token_phrase =
  'OcGsWVzTcA5QVaf1HkdrlYVPzPprZxG8h21tbbwkThCSuomHNUEAQyIRHx1GyXvWZj8BxMCiUwbeg3RtiyjgeE5aDV8wF5Bthljr';

function generateToken(userId: string): string {
  const claims = {
    url: 'https://us-central1-civic-matrix-327921.cloudfunctions.net/app/', // The URL of your service
    userId: userId, // The UID of the user in your system
    scope: 'user',
  };
  const token = jwt.sign(claims, token_phrase);
  return token;
}

function getUserId(token?: string): string | null {
  if (!token) {
    throw new APIError(401, 'No crenditial found');
  }

  if (!token.startsWith('Bearer')) {
    throw new APIError(400, 'Please provide bearer token');
  }

  const result = jwt.verify(token.substring(7), token_phrase);

  const userId = (result as {userId: string}).userId;

  if (!userId) {
    throw new APIError(401, 'Invalid token');
  }

  return userId;
}

async function signUp(user: UserSignupDTO): Promise<UserDTO> {
  if (!user.password) {
    throw new APIError(400, 'NO PASSWORD');
  }
  if (!user.email) {
    throw new APIError(400, 'NO EMAIL');
  }
  if (!user.name) {
    throw new APIError(400, 'NO NAME');
  }

  //check email duplication
  if (await getUserFromEmail(user.email)) {
    throw new APIError(409, 'EMAIL EXIST');
  }

  //set hash password
  const userToSignUp: UserSignupDTO = user;
  const hashedPassword = passwordHash.generate(user.password);
  userToSignUp.password = hashedPassword;
  // patch database transactions
  const newUserRef = await userRef.add(userToSignUp);
  const userToken = generateToken(newUserRef.id);
  // return user object, TODO:: remove password, update user details directly
  return await updateUserDetails(newUserRef.id, {token: userToken});
}

async function logIn(userToLogIn: UserLoginDTO): Promise<UserDTO> {
  if (!userToLogIn.email) {
    throw new APIError(400, 'NO EMAIL');
  }

  if (!userToLogIn.password) {
    throw new APIError(400, 'NO PASSWORD');
  }

  const currentUser = await getUserFromEmail(userToLogIn.email);

  if (currentUser) {
    if (passwordHash.verify(userToLogIn.password, currentUser.password)) {
      return {
        name: currentUser.name,
        token: currentUser.token,
        email: currentUser.email,
      };
    } else {
      throw new APIError(409, 'Password not match');
    }
  } else {
    throw new APIError(401, 'Please Sign Up first');
  }
}

async function update(
  userNameObj: UserUpdateDTO,
  authToken?: string
): Promise<UserDTO> {
  const userId = getUserId(authToken);
  if (!userId) {
    throw new APIError(401, 'Invalid token');
  }
  const updatedUser = await updateUserDetails(userId, userNameObj);
  if (!updatedUser) {
    throw new APIError(500, 'Failed update');
  }
  return updatedUser;
}

//return type
async function updateUserDetails(
  userId: string,
  newKeyValuePair: object
): Promise<UserDTO> {
  await userRef.doc(userId).update(newKeyValuePair);
  const user = (await userRef.doc(userId).get()).data();
  if (!user) {
    throw new APIError(404, 'User not found');
  }
  return {
    name: user.name,
    email: user.email,
    token: user.token,
  };
}

async function getUserFromEmail(
  email: string
): Promise<UserWithPassword | undefined> {
  const usersWithEmailSnapshot = await userRef
    .where('email', '==', email)
    .get();
  if (usersWithEmailSnapshot.size > 0) {
    const result = usersWithEmailSnapshot.docs[0].data();
    return {
      name: result.name,
      email: result.email,
      token: result.token,
      password: result.password,
    };
  }
  return undefined;
}

const userModel = {logIn, signUp, update, getUserId};
export default userModel;
