
// the name of your microservice e.g. 'orders', 'prime'
let serviceName = 'prime';

// require events log helper module
const EventLog = require('./events-sender');

// create a new event log instance with your service name
const events = new EventLog(serviceName);

// register callback on Event Queue connected
events.on('connect', () => {
  // event queue ready
});

// create a signup event
let signup = {
  userId: 'userId',       // string 
  orderId: 'orderId',     // string
  cartSize: 56,           // number
  timestamp: Date.now()   // in ms since Jan 1
};

events.send('trialsignup', signup);

let optout = {
  userId: 'userid',       // string
  signUp: '2017-11-08',   // string year-month-day
  timestamp: Date.now()   // in ms since Jan 1
};

events.send('trialoptout', optout);