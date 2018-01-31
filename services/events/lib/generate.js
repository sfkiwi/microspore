const fs = require('fs');
const faker = require('faker');
const randomDatetime = require('random-datetime');
const randomYear = require('random-year');
const randomMonth = require('random-month');
const randomDay = require('random-day');

const NUM_USERS = 1000000;
const NUM_ORDERS = 1000000;


const users = [];
for (let i = 0; i < NUM_USERS; i++) {
  users[i] = Math.floor(Math.random() * 1000000000000).toString();
}


const orders = fs.createWriteStream('./fixtures/ordersneworder.json');
const prime1 = fs.createWriteStream('./fixtures/primetrialsignup.json');
const prime2 = fs.createWriteStream('./fixtures/primetrialoptout.json');


orders.write('[');
prime1.write('[');
prime2.write('[');


let i = NUM_ORDERS;

let writeLine = function() {
  let orders_Ok = true;
  let prime1_Ok = true;
  let prime2_Ok = true;
  do {
    i--;
    if (i === 0) {
      // last time!
      let year = randomYear({ min: 2012, max: 2018 });
      let month = randomMonth({ raw: true });
      let day = randomDay({ year: year, month: month });
      let orderId = Math.floor(Math.random() * NUM_ORDERS * 1000);
      let userId = users[Math.floor(Math.random() * NUM_USERS)];
      
      //create order
      orders.write(`{"id":"${faker.random.uuid()}","day":"${year}-${month.number}-${day}","created":"${randomDatetime({ year: year, month: month.number, day: day })}","orderId":"${orderId}","userId":"${userId}","amount":"${Math.floor(Math.random() * 150)}"}]`);
      
      //create prime sign up for all users
      prime1.write(`{"id":"${faker.random.uuid()}","day":"${year}-${month.number}-${day}","created":"${randomDatetime({ year: year, month: month.number, day: day })}","orderId":"${orderId}","userId":"${userId}"}]`);
      
      //create prime opt out for some users
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
      
      prime2.write(`{"id":"${faker.random.uuid()}","day":"${year}-${month.number}-${day}","created":"${randomDatetime({ year: year, month: month.number, day: day })}","userId":"${userId}"}]`);
      
      
    } else {
      
      let year = randomYear({ min: 2012, max: 2018 });
      let month = randomMonth({ raw: true });
      let day = randomDay({ year: year, month: month });
      let orderId = Math.floor(Math.random() * NUM_ORDERS * 1000);
      let userId = users[Math.floor(Math.random() * NUM_USERS)];
      // see if we should continue, or wait
      // don't pass the callback, because we're not done yet.
      //create order
      orders_Ok = orders.write(`{"id":"${faker.random.uuid()}","day":"${year}-${month.number}-${day}","created":"${randomDatetime({ year: year, month: month.number, day: day })}","orderId":"${orderId}","userId":"${userId}","amount":"${Math.floor(Math.random() * 150)}"},\n`);
      
      //create prime sign up for all users
      prime1_Ok = prime1.write(`{"id":"${faker.random.uuid()}","day":"${year}-${month.number}-${day}","created":"${randomDatetime({ year: year, month: month.number, day: day })}","orderId":"${orderId}","userId":"${userId}"},\n`);
      
      //create prime opt out for some users
      if (Math.random() < 0.60) {
        
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
        
        prime2_Ok = prime2.write(`{"id":"${faker.random.uuid()}","day":"${year}-${month.number}-${day}","created":"${randomDatetime({ year: year, month: month.number, day: day })}","userId":"${userId}"},\n`);
      }
    }
  } while (i > 0 && prime1_Ok && orders_Ok && prime2_Ok);
  if (i > 0) {
    // had to stop early!
    // write some more once it drains
    if (!prime1_Ok) {
      prime1.once('drain', () => {
        console.log('draining prime 1');
        writeLine();
      });
    }
    if (!orders_Ok) {
      orders.once('drain', () => {
        console.log('draining orders');
        writeLine();
      });
    }
    if (!prime2_Ok) {
      prime2.once('drain', () => {
        console.log('draining prime 2');
        writeLine();
      });
    }
  }
};

writeLine();



