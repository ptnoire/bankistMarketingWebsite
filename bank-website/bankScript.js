'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const calcDisplaySummary = function(mov) {
  const incomes = mov.movements
  .filter(mov => mov > 0)
  .reduce((acc, mov)=> acc + mov, 0);
  labelSumIn.textContent = `${incomes} €`;

  const outcomes = mov.movements
  .filter(mov => mov < 0)
  .reduce((acc, mov)=> acc - mov, 0);
  labelSumOut.textContent = `${outcomes} €`;

  const interest = mov.movements
  .filter(mov => mov > 0)
  .map(deposit => deposit * mov.interestRate / 100)
  .filter(dep => dep >= 1)
  .reduce((acc, mov)=> acc + mov, 0);
  labelSumInterest.textContent = `${interest} €`
}

const calcDisplayBalance = function(account){
  const balance = account.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${balance} €`
  // Adding a balance to the account each time this function is called.
  account.balance = balance;
}

const makeUserName = function(accs){ 
  accs.forEach(function(acc){
    acc.userName = acc.owner
    .toLowerCase()
    .split(' ')
    .map(word => word[0]).join('');
  })
}
makeUserName(accounts);

const displayMovements = function(movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function(mov, i){
    const type = mov > 0 ? 'deposit' : 'withdrawal'
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__value">${mov} €</div>
    </div>`
    containerMovements.insertAdjacentHTML('afterbegin', html);
  })
}

const updateUI = function(acc) {
  displayMovements(acc.movements)
  calcDisplayBalance(acc)
  calcDisplaySummary(acc)
}
// ------ Event Listeners ------

// LOGIN
let currentAccount = ''
btnLogin.addEventListener('click', function(e){
  // Prevent for from submitting (A button's default option is to refresh the page)
  e.preventDefault();
  // Getting correct login information (initials: username, and PIN)
  currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value);
  if (Number(inputLoginPin.value) === currentAccount?.pin) {
    // Display UI, change opacity in .app to 100 from 0
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    // Display and Calculate Balances for account.
      updateUI(currentAccount);
    // Clear username / pin fields.
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  }
})
// Sort Button
let sortState = false;
btnSort.addEventListener('click', function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements, !sortState);
  sortState = !sortState;
})

// Transfer Function
btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
    // Get the account money is transfering from:
  // const xferFromAcc = accounts.find(acc => acc.owner.split(' ')[0] === labelWelcome.textContent.split(' ')[2])

    // Get the account money is transfering to
  const xferToAcc = accounts.find(acc => acc.userName === inputTransferTo.value)
  // get the amount of money being transfered
  const xferAmmount = Number(inputTransferAmount.value);

  // Add a movement to both accounts then use previous functions to do the work.
  if (xferAmmount > 0 && 
    xferToAcc && 
    currentAccount.balance >= xferAmmount && 
    xferToAcc?.userName !== currentAccount.userName){
      xferToAcc.movements.push(xferAmmount);
      currentAccount.movements.push(-Math.abs(xferAmmount)); // -Math.abs gives a negative value
      inputTransferAmount.value = inputTransferTo.value = '';
      updateUI(currentAccount);
  }
  inputTransferAmount.value = inputTransferTo.value = '';
})

// Loan Button
btnLoan.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  console.log(amount);
  if (amount > 0 && currentAccount.movements.some(mov => mov > amount * .1)) {
    console.log('worked.')
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
})

// Close Account
btnClose.addEventListener('click', function(e) {
  e.preventDefault();
  if (currentAccount.userName == inputCloseUsername.value &&
     currentAccount.pin == inputClosePin.value) {
      const index = accounts.findIndex(acc => acc.userName === currentAccount.userName)
      accounts.splice(index, 1);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started`;
      inputClosePin.value = inputCloseUsername.value = '';
  }
})