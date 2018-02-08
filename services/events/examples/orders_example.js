
// the name of your microservice e.g. 'orders', 'prime'
let serviceName = 'orders';

// require events log helper module
const EventLog = require('./events-sender');

// create a new event log instance with your service name
const events = new EventLog(serviceName);

// register callback on Event Queue connected
events.on('connect', () => {
  // event queue ready
});
  
// create an order event
let order = {
  orderId: 'orderId',
  userId: 'userId',
  amount: 45,
  timestamp: Date.now()
};

// send the event to the SQS queue
events.send('neworder', order)

// optionally provide .then handler
  .then((result) => {
    //message sent
  })

// optionally async await
let result = await events.send('neworder', order);



