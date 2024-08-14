'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account0 = {
  owner: 'Anush Kumar K',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1, // %
  pin: 8888,
};

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

const accounts = [account0, account1, account2, account3, account4];

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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
//Coding challenge#2 of Arrays
// const calcAverageHumanAge = function (ages) {
//   const equivalentHumanAge = ages
//     .map(dogAge => {
//       if (dogAge <= 2) return 2 + dogAge;
//       if (dogAge > 2) return 16 + dogAge * 4;
//     })
//     .filter(HumanAge => HumanAge >= 18)
//     .reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
//   console.log(equivalentHumanAge);
// };

// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

//displaying transaction(movements) & also using displayMovement()
// to sort the transaction based on state variable which is sort here

const displayMovement = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach((e, i) => {
    const type = e > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${e}€</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// Sorting transaction if sort is clicked
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovement(movements, !sorted);
  sorted = !sorted;
});
//
//Displaying the balace amout in the UI
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, cur) {
    return acc + cur;
  });
  labelBalance.textContent = `${acc.balance}€`;
};

//Computing in & out cashflow & displaying
const calcDisplaySummary = function (acc) {
  const income = acc.movements.filter(e => e > 0).reduce((acc, e) => acc + e);
  labelSumIn.textContent = `${income}€`;
  const out = acc.movements.filter(e => e < 0).reduce((acc, e) => acc + e);
  labelSumOut.textContent = `${Math.abs(out)}€`;
  const interest = acc.movements
    .filter(mov => mov > 0) // interest calculated onl for deposits
    .map(deposit => (deposit * acc.interestRate) / 100) //account holder will get 1.2% interest rate
    .filter(int => int >= 1) //back add interst only if it is above or equal to 1 euro
    .reduce((acc, int) => acc + int); //adding all the individual interest
  labelSumInterest.textContent = `${interest}€`;
};

//Computing Usernames & adding that  user name to repective accont objects
const computeUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(e => e[0])
      .join('');
  });
};
computeUserName(accounts);
//Update UI
const updateUI = function (acc) {
  //display movements
  displayMovement(acc.movements);
  //display balance
  calcDisplayBalance(acc);
  //display summary
  calcDisplaySummary(acc);
};
let currentAccount;
//Implementing login
btnLogin.addEventListener('click', function (event) {
  event.preventDefault();
  console.log('LOGIN');
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount.pin === +inputLoginPin.value) {
    containerApp.style.opacity = 1;
    labelWelcome.textContent = `Welcome ${currentAccount.owner.split(' ')[0]}`;

    //clearing input fileds & removing the blinking cursor| while we tap ENTER btn after entering the pin

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});

//Enabling Transfer of money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const money = Number(inputTransferAmount.value);
  const target = inputTransferTo.value;

  const targetAccount = accounts.find(acc => acc.username === target);

  if (money > 0) {
    if (
      currentAccount.balance >= money &&
      targetAccount &&
      currentAccount.username !== targetAccount.username
    ) {
      currentAccount.movements.push(-money);
      targetAccount.movements.push(money);
      inputTransferTo.value = inputTransferAmount.value = '';
    }
    updateUI(currentAccount);
  }
});
//Rquesting the Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some(mov => mov >= amount * 0.1) &&
    currentAccount.balance >= amount * 0.1
  ) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
});
//deleting an account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === inputCloseUsername.value
    );

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
});

document
  .querySelector('.balance__value')
  .addEventListener('click', function () {
    const UI = Array.from(
      document.querySelectorAll('.movements__value'),
      el => el.textContent
    );
    console.log(UI);
  });
