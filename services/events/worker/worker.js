import EventQueue from './queue';
import processOrderEvents from './ordersEvents';
import processPrimeEvents from './primeEvents';

const queue = new EventQueue();

const eventMessageHandlers = {
  orders: processOrderEvents,
  prime: processPrimeEvents
};


queue.on('data', (msg) => {
  if (eventMessageHandlers[msg.service.StringValue]) {
    eventMessageHandlers[msg.service.StringValue](msg);
  }
});

