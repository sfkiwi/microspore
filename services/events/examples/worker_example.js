import EventQueue from './events-consumer';

const queue = new EventQueue();

// register callback on Event Queue connected
events.on('connect', () => {
  // event queue ready
});

// Process Queue Messages
queue.on('data', (msg) => {
  // process message
});

