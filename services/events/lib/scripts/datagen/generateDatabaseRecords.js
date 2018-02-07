const fs = require('fs');
const faker = require('faker');
const randomDatetime = require('random-datetime');
const randomYear = require('random-year');
const randomMonth = require('random-month');
const randomDay = require('random-day');

const Progress = require('progress-barzz');
Progress.init(100);

const NUM_USERS = 1000000;
var NUM_ORDERS = 100000;
if (process.argv.length > 3) {
  NUM_ORDERS = process.argv[3];
}

const users = [];
for (let i = 0; i < NUM_USERS; i++) {
  users[i] = faker.random.uuid();
}

let suffix = '';
if (process.argv.length > 2) {
  suffix = process.argv[2];
}

const orders = fs.createWriteStream(`../fixtures/ordersneworder${suffix}.json`);
const prime1 = fs.createWriteStream(`../fixtures/primetrialsignup${suffix}.json`);
const prime2 = fs.createWriteStream(`../fixtures/primetrialoptout${suffix}.json`);


orders.write('[');
prime1.write('[');
prime2.write('[');



let i = NUM_ORDERS;
let ordersCount = 0;
let prime1Count = 0;
let prime2Count = 0;

let orders_Ok = true;
let prime1_Ok = true;
let prime2_Ok = true;

orders.on('finish', () => {
  console.error(`${ordersCount} lines written to ordersneworder${suffix}`);
});

prime1.on('finish', () => {
  console.error(`${prime1Count} lines written to primetrialsignup${suffix}`);
});

prime2.on('finish', () => {
  console.error(`${prime2Count} lines written to primetrialoptout${suffix}`);
});

// had to stop early!
// write some more once it drains
prime1.on('drain', () => {
  if (i > 0) {
    prime1_Ok = true;
    writeLine();
  }
});

orders.on('drain', () => {
  if (i > 0) {
    orders_Ok = true;
    writeLine();
  }
});

prime2.on('drain', () => {
  if (i > 0) {
    prime2_Ok = true;
    writeLine();
  }
});

let writeLine = function() {
  do {
    i--;

    if (i % (NUM_ORDERS / 100) === 0) {
      process.stdout.clearLine();
      process.stdout.cursorTo(0); 
      process.stdout.write(Progress.tick());
      //console.log(Progress.tick());
    }

    if (i === 0) {
      // last time!
      let year = randomYear({ min: 2017, max: 2018 });
      let month = randomMonth({ raw: true });
      let day = randomDay({ year: year, month: month });
      let orderId = Math.floor(Math.random() * NUM_ORDERS * 1000);
      let userId = users[Math.floor(Math.random() * NUM_USERS)];
      let amount = Math.floor(Math.random() * 150);
      // let timestamp = randomDatetime({ year: year, month: month.number, day: day });
      //create order
      orders.end(`{"year":"${year}","month":"${month.number}","day":"${day}","created":"${randomDatetime({ year: year, month: month.number, day: day })}","orderId":"${orderId}","userId":"${userId}","amount":"${amount}"}]\n`);
      ordersCount++;
      //create prime sign up for all users
      prime1.end(`{"year":"${year}","month":"${month.number}","day":"${day}","amount":"${amount}","created":"${randomDatetime({ year: year, month: month.number, day: day })}","orderId":"${orderId}","userId":"${userId}"}]\n`);
      prime1Count++;
      //create prime opt out for some users
      let signup = `${year}-${month.number}-${day}`;
      let newday = day + Math.floor(Math.random() * 29);
      
      if (newday <= day) {
        day = newday;
        month.number++;
      } else if (newday > month.days) {
        day = newday - month.days;
        month.number++;
      } else {
        day = newday;
      }
      
      if (month.number > 12) {
        month.number = 1;
        year++;
      }
      
      prime2.end(`{"year":"${year}","month":"${month.number}","day":"${day}","signup":"${signup}","created":"${randomDatetime({ year: year, month: month.number, day: day })}","userId":"${userId}"}]\n`);
      prime2Count++;

      console.log('');
      
    } else if (i > 0) {
      
      let year = randomYear({ min: 2012, max: 2018 });
      let month = randomMonth({ raw: true });
      let day = randomDay({ year: year, month: month });
      let orderId = Math.floor(Math.random() * NUM_ORDERS * 1000);
      let userId = users[Math.floor(Math.random() * NUM_USERS)];
      let amount = Math.floor(Math.random() * 150);
      
      // see if we should continue, or wait
      // don't pass the callback, because we're not done yet.
      //create order
      orders_Ok = orders.write(`{"year":"${year}","month":"${month.number}","day":"${day}","created":"${randomDatetime({ year: year, month: month.number, day: day })}","orderId":"${orderId}","userId":"${userId}","amount":"${Math.floor(Math.random() * 150)}"},\n`);
      ordersCount++;

      //create prime sign up for all users
      prime1_Ok = prime1.write(`{"year":"${year}","month":"${month.number}","day":"${day}","amount":"${amount}","created":"${randomDatetime({ year: year, month: month.number, day: day })}","orderId":"${orderId}","userId":"${userId}"},\n`);

      prime1Count++;

      //create prime opt out for some users
      if (Math.random() < 0.60) {
        
        let signup = `${year}-${month.number}-${day}`;
        let newday = day + Math.floor(Math.random() * 29);
        
        if (newday <= day) {
          day = newday;
          month.number++;
        } else if (newday > month.days) {
          day = newday - month.days;
          month.number++;
        } else {
          day = newday;
        }
        
        if (month.number > 12) {
          month.number = 1;
          year++;
        }
        
        prime2_Ok = prime2.write(`{"year":"${year}","month":"${month.number}","day":"${day}","signup":"${signup}","created":"${randomDatetime({ year: year, month: month.number, day: day })}","userId":"${userId}"},\n`);
        prime2Count++;
      }
    }
  } while (i > 0 && prime1_Ok && orders_Ok && prime2_Ok);
};

writeLine();



