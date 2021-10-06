import DB from '../lib/database';
import {UserDTO, UserLoginDTO, UserSignupDTO, UserUpdateDTO} from './type';
import jwt from 'jsonwebtoken';
import passwordHash from 'password-hash';
import {APIError} from '../lib/api-error';

const userRef = DB.collection('users');
const token_phrase =
  'OcGsWVzTcA5QVaf1HkdrlYVPzPprZxG8h21tbbwkThCSuomHNUEAQyIRHx1GyXvWZj8BxMCiUwbeg3RtiyjgeE5aDV8wF5Bthljr';

function generateToken(userId: string) {
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
  return (result as {userId: string}).userId;
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
  //update token
  if (await updateUserDetails(newUserRef.id, {token: userToken})) {
    const userObj: UserDTO = {...userToSignUp, token: userToken};
    // return user object
    return userObj;
  } else {
    throw new APIError(502, 'FAILED ADD TOKEN');
  }
}

async function logIn(userToLogIn: UserLoginDTO) {
  try {
    if (!userToLogIn.email) {
      throw new APIError(400, 'NO EMAIL');
    }

    if (!userToLogIn.password) {
      throw new APIError(400, 'NO PASSWORD');
    }

    const currentUser = await getUserFromEmail(userToLogIn.email);

    if (currentUser) {
      if (passwordHash.verify(userToLogIn.password, currentUser.password)) {
        return currentUser;
      } else {
        throw new APIError(409, 'Password not match');
      }
    } else {
      throw new APIError(401, 'Please Sign Up first');
    }
  } catch (error) {
    throw new APIError(503, 'DB Error');
  }
}

async function update(userNameObj: UserUpdateDTO, authToken?: string) {
  const userId = getUserId(authToken);
  if (!userId) {
    throw new APIError(401, 'Invalid token');
  }
  const updatedUser = await updateUserDetails(userId, userNameObj);
  if (!updatedUser) {
    throw new APIError(500, 'Failed update');
  }
  return updatedUser.data();
}

async function updateUserDetails(userId: string, newKeyValuePair: object) {
  try {
    await userRef.doc(userId).update(newKeyValuePair);
    return await userRef.doc(userId).get();
  } catch (error) {
    return false;
  }
}

async function getUserFromEmail(email: string) {
  try {
    // query firestore, load all users with specified email
    const userWithEmail = await userRef.where('email', '==', email);
    const usersMatchEmail = await userWithEmail.get();
    if (usersMatchEmail.size > 0) {
      return usersMatchEmail.docs[0].data();
    }
    return null;
  } catch (error) {
    return null;
  }
}

const userModel = {logIn, signUp, update, getUserId};
export default userModel;
