"use strict";
async function update(userId) {
    return userId;
}
async function signUp(userName, password) {
    return 'Sign up: username: ' + userName + ' password: ' + password;
}
async function logIn(userName, password) {
    return 'Log in: username: ' + userName + ' password: ' + password;
}
module.exports = {
    logIn,
    signUp,
    update,
};
//# sourceMappingURL=UserModel.js.map