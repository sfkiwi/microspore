const AWS = require('aws-sdk');
const Promise = require('bluebird');
AWS.config.update({ region: 'us-east-2' });
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
var stats = require('../../lib/statsD'); 

// stats
var pollingStart = 0;
var processBatchStart = 0;
var deleteMessagesStart = 0;

sqs.getQueueUrlAsync = Promise.promisify(sqs.getQueueUrl);
sqs.receiveMessageAsync = Promise.promisify(sqs.receiveMessage);
sqs.deleteMessageAsync = Promise.promisify(sqs.deleteMessage);
sqs.deleteMessageBatchAsync = Promise.promisify(sqs.deleteMessageBatch);

var params = {
  QueueName: 'events'
};

var EventQueue = function () {

  this.handlers = {};
  this.queueUrl = null;
  this.duplicates = {};

  let params = {
    QueueName: 'events'
  };

  sqs.getQueueUrlAsync(params)

    .then((data) => {
      this.queueUrl = data.QueueUrl;

      if (this.handlers['connect']) {
        this.handlers['connect'].forEach(handler => handler());
      }

      if (this.handlers['data']) {
        this.pollMessages();
      }
    });
};

EventQueue.prototype.pollMessages = function () {

  pollingStart = Date.now();
    
  params = {
    AttributeNames: [
      'SentTimestamp'
    ],
    MaxNumberOfMessages: 10,
    MessageAttributeNames: [
      'All'
    ],
    QueueUrl: this.queueUrl,
    VisibilityTimeout: 200,
    WaitTimeSeconds: 20
  };

  sqs.receiveMessageAsync(params)

    .then((data) => {

      if (data.Messages) {

        processBatchStart = Date.now();
        stats.increment('.backend.worker.counters.messages', data.Messages.Length, 0.25);  

        let done = [];

        // loop through all messages received
        data.Messages.forEach((msg, index) => {

          // check if message has already been received
          if (!this.duplicates[msg.MessageId]) {
            this.duplicates[msg.MessageId] = true;

            // call subscriber callback with the message data
            this.handlers['data'].forEach(handler => handler(msg.MessageAttributes));
          }
          
          // add processed messages to list for deletion from queue
          done.push({ Id: `${index}`, ReceiptHandle: msg.ReceiptHandle });
        });

        var params = {
          Entries: done,
          QueueUrl: this.queueUrl /* required */
        };

        stats.timing('.backend.worker.timers.processBatch', Date.now() - processBatchStart, 0.25);
        deleteMessagesStart = Date.now();  

        return sqs.deleteMessageBatchAsync(params);
      }
    })

    .then((data) => {

      // reset long polling
      stats.timing('.backend.worker.timers.polling', Date.now() - pollingStart, 0.25);  
      stats.timing('.backend.worker.timers.deleteMessages', Date.now() - deleteMessagesStart, 0.25);  
      this.pollMessages();
    })

    .catch((err) => {
      console.log(err);
    });
};

EventQueue.prototype.on = function (event, callback) {

  if (event ===  'connect') {

    if (this.queueUrl) {
      callback();
    } else {
      if (!this.handlers[event]) {
        this.handlers[event] = [];
      }
      this.handlers[event].push(callback);
    }
  }

  if (event === 'data') {

    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(callback);

    if (this.queueUrl) {
      this.pollMessages();
    }
  }
};

module.exports = EventQueue;