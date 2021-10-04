async function getAllTransactions() {
  return [
    {id: 1, amount: 10},
    {id: 2, amount: 123},
  ];
}

async function createTransaction(userName: string, password: string) {
  return 'Sign up: username: ' + userName + ' password: ' + password;
}

async function logIn(userName: string, password: string) {
  return 'Log in: username: ' + userName + ' password: ' + password;
}

module.exports = {
  getAllTransactions,
  signUp,
  update,
};
