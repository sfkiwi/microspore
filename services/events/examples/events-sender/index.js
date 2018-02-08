const AWS = require('aws-sdk');
const Promise = require('bluebird');

AWS.config.update({ region: 'us-east-2' });

var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

sqs.getQueueUrlAsync = Promise.promisify(sqs.getQueueUrl);
sqs.sendMessageAsync = Promise.promisify(sqs.sendMessage);
sqs.sendMessageBatchAsync = Promise.promisify(sqs.sendMessageBatch);


var EventLog = function(service) {
  
  if (!service) {
    throw new Error('Sending service should be provided as argument');
  }

  this.handlers = {};
  this.queueUrl = null;
  this.service = service;

  let params = {
    QueueName: 'events'
  };

  sqs.getQueueUrlAsync(params)

    .then((data) => {
      this.queueUrl = data.QueueUrl;

      if (this.handlers['connect']) {
        this.handlers['connect'].forEach(handler => handler());
      }
    });
};

EventLog.prototype.on = function(event, callback) {
  
  if (this.queueUrl && event === 'connect') {
    callback();   
     
  } else {

    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(callback);
  }
};

EventLog.prototype.send = function(type, payload) {
  if (this.queueUrl) {

    let messageAttributes = {};

    // set service name identifier
    messageAttributes.service = {
      DataType: 'String',
      StringValue: this.service
    };

    // set message type identifier
    messageAttributes.type = {
      DataType: 'String',
      StringValue: type
    };
    
    // convert payload to SQS format
    for (let key in payload) {
      messageAttributes[key] = messageAttributes[key] || {};
      
      switch (typeof payload[key]) {

      case 'number':
        messageAttributes[key].DataType = 'String';
        messageAttributes[key].StringValue = payload[key].toString();
        break;

      case 'string':
      default:
        messageAttributes[key].DataType = 'String';
        messageAttributes[key].StringValue = payload[key];
        break;
      }
    }
    
    // bundle up message params
    let params = {
      MessageBody: type, 
      QueueUrl: this.queueUrl, 
      MessageAttributes: messageAttributes
    };

    return sqs.sendMessageAsync(params)

      .catch((err) => {
        console.log(err);
      });

  } else {
    throw new Error('No connection to Event Log');
  }
};

module.exports = EventLog;