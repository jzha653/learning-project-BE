async function update(userId: string) {
  return userId;
}

async function signUp(userName: string, password: string) {
  return 'Sign up: username: ' + userName + ' password: ' + password;
}

async function logIn(userName: string, password: string) {
  return 'Log in: username: ' + userName + ' password: ' + password;
}

module.exports = {
  logIn,
  signUp,
  update,
};
