const faker = require('faker');
const randomDatetime = require('random-datetime');
const randomYear = require('random-year');
const randomMonth = require('random-month');
const randomDay = require('random-day');
const Progress = require('progress-barzz');

let ordersReady = false;
let primeReady = false;

const MESSAGE_DELAY = 5;
const NUM_USERS = 100000;
const NUM_ORDERS = 100000;

let showProgress = false;
let NUM_MESSAGES = 1000; //default
let messageCount = 0;
if (process.argv.length > 2) {
  NUM_MESSAGES = process.argv[2];
  Progress.init(NUM_MESSAGES);
  showProgress = true;
}

const EventLog = require('./events');
const orders = new EventLog('orders');
const prime = new EventLog('prime');

orders.on('connect', () => {
  ordersReady = true;

  if (primeReady) {
    setTimeout(sendMessages, MESSAGE_DELAY);
  }
});

prime.on('connect', () => {
  primeReady = true;

  if (ordersReady) {
    setTimeout(sendMessages, MESSAGE_DELAY);
  }
});


// Generate Users
const users = [];
for (let i = 0; i < NUM_USERS; i++) {
  users[i] = faker.random.uuid();
}


let sendMessages = function() {


  let year = randomYear({ min: 2017, max: 2018 });
  let month = randomMonth({ raw: true });
  let day = randomDay({ year: year, month: month });
  let orderId = Math.floor(Math.random() * NUM_ORDERS * 1000);
  let userId = users[Math.floor(Math.random() * NUM_USERS)];
  let amount = Math.floor(Math.random() * 1500);

  year = 2017;
  month.number = 11;
  day = 8;
  
  //create order
  let order = {
    orderId: orderId,
    userId: userId,
    amount: amount,
    timestamp: new Date(year, month.number - 1, day).getTime()
  };

  orders.send('neworder', order);

  let signup = {
    userId: userId,
    orderId: orderId,
    cartSize: amount,
    timestamp: new Date(year, month.number - 1, day).getTime()
  };

  prime.send('trialsignup', signup);


  if (Math.random() < 0.6) {
    let optout = {
      userId: userId,
      signUp: `${year}-${month.number}-${day}`,
      // timestamp: new Date(year, month.number, day + (Math.floor(Math.random() * 30))).getTime()
      // note that Date takes a zero based month number
      timestamp: new Date(year, month.number - 1, day + Math.floor(Math.random() * 30)).getTime()
    };

    prime.send('trialoptout', optout);
  }

  messageCount++;

  if (showProgress) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(Progress.tick());
  }

  if (messageCount < NUM_MESSAGES) {
    setTimeout(sendMessages, MESSAGE_DELAY);
  }
};
