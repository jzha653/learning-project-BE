"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../lib/database"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const password_hash_1 = __importDefault(require("password-hash"));
const api_error_1 = require("../lib/api-error");
const userRef = database_1.default.collection('users');
const token_phrase = 'OcGsWVzTcA5QVaf1HkdrlYVPzPprZxG8h21tbbwkThCSuomHNUEAQyIRHx1GyXvWZj8BxMCiUwbeg3RtiyjgeE5aDV8wF5Bthljr';
function generateToken(userId) {
    const claims = {
        url: 'https://us-central1-civic-matrix-327921.cloudfunctions.net/app/',
        userId: userId,
        scope: 'user',
    };
    const token = jsonwebtoken_1.default.sign(claims, token_phrase);
    return token;
}
function getUserId(token) {
    if (!token) {
        throw new api_error_1.APIError(401, 'No crenditial found');
    }
    if (!token.startsWith('Bearer')) {
        throw new api_error_1.APIError(400, 'Please provide bearer token');
    }
    const result = jsonwebtoken_1.default.verify(token.substring(7), token_phrase);
    return result.userId;
}
async function signUp(user) {
    if (!user.password) {
        throw new api_error_1.APIError(400, 'NO PASSWORD');
    }
    if (!user.email) {
        throw new api_error_1.APIError(400, 'NO EMAIL');
    }
    if (!user.name) {
        throw new api_error_1.APIError(400, 'NO NAME');
    }
    //check email duplication
    if (await getUserFromEmail(user.email)) {
        throw new api_error_1.APIError(409, 'EMAIL EXIST');
    }
    //set hash password
    const userToSignUp = user;
    const hashedPassword = password_hash_1.default.generate(user.password);
    userToSignUp.password = hashedPassword;
    // patch database transactions
    const newUserRef = await userRef.add(userToSignUp);
    const userToken = generateToken(newUserRef.id);
    //update token
    if (await updateUserDetails(newUserRef.id, { token: userToken })) {
        const userObj = { ...userToSignUp, token: userToken };
        // return user object
        return userObj;
    }
    else {
        throw new api_error_1.APIError(502, 'FAILED ADD TOKEN');
    }
}
async function logIn(userToLogIn) {
    try {
        if (!userToLogIn.email) {
            throw new api_error_1.APIError(400, 'NO EMAIL');
        }
        if (!userToLogIn.password) {
            throw new api_error_1.APIError(400, 'NO PASSWORD');
        }
        const currentUser = await getUserFromEmail(userToLogIn.email);
        if (currentUser) {
            if (password_hash_1.default.verify(userToLogIn.password, currentUser.password)) {
                return currentUser;
            }
            else {
                throw new api_error_1.APIError(409, 'Password not match');
            }
        }
        else {
            throw new api_error_1.APIError(401, 'Please Sign Up first');
        }
    }
    catch (error) {
        throw new api_error_1.APIError(503, 'DB Error');
    }
}
async function update(userNameObj, authToken) {
    const userId = getUserId(authToken);
    if (!userId) {
        throw new api_error_1.APIError(401, 'Invalid token');
    }
    const updatedUser = await updateUserDetails(userId, userNameObj);
    if (!updatedUser) {
        throw new api_error_1.APIError(500, 'Failed update');
    }
    return updatedUser.data();
}
async function updateUserDetails(userId, newKeyValuePair) {
    try {
        await userRef.doc(userId).update(newKeyValuePair);
        return await userRef.doc(userId).get();
    }
    catch (error) {
        return false;
    }
}
async function getUserFromEmail(email) {
    try {
        // query firestore, load all users with specified email
        const userWithEmail = await userRef.where('email', '==', email);
        const usersMatchEmail = await userWithEmail.get();
        if (usersMatchEmail.size > 0) {
            return usersMatchEmail.docs[0].data();
        }
        return null;
    }
    catch (error) {
        return null;
    }
}
const userModel = { logIn, signUp, update, getUserId };
exports.default = userModel;
//# sourceMappingURL=model.js.map