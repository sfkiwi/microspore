const AWS = require('aws-sdk');
const Promise = require('bluebird');

AWS.config.update({ region: 'us-east-2' });

var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

sqs.getQueueUrlAsync = Promise.promisify(sqs.getQueueUrl);
sqs.receiveMessageAsync = Promise.promisify(sqs.receiveMessage);
sqs.deleteMessageAsync = Promise.promisify(sqs.deleteMessage);
sqs.deleteMessageBatchAsync = Promise.promisify(sqs.deleteMessageBatch);

var params = {
  QueueName: 'events'
};

var queueUrl;
var duplicates = {};

sqs.getQueueUrlAsync(params)

  .then((data) => {
    console.log('Success', data.QueueUrl);
    queueUrl = data.QueueUrl;
    pollMessages();
  });


var pollMessages = function() {
  
  params = {
    AttributeNames: [
      'SentTimestamp'
    ],
    MaxNumberOfMessages: 10,
    MessageAttributeNames: [
      'All'
    ],
    QueueUrl: queueUrl,
    VisibilityTimeout: 200,
    WaitTimeSeconds: 20
  };

  sqs.receiveMessageAsync(params)

    .then((data) => {
      
      if (data.Messages) {
        
        let done = [];
        console.log('');
        data.Messages.forEach((msg, index) => {
          // console.log(`\n${index + 1}:`);
          console.log(msg.Body + ' received');
          if (duplicates[msg.Body]) {
            console.log('/////////////// DUPLICATE ///////////////////////');
          } else {
            duplicates[msg.Body] = true;
          }
          // console.log('userId:', msg.MessageAttributes.userId.StringValue);
          // console.log('orderId:', msg.MessageAttributes.orderId.StringValue);
          done.push({Id: `${index}`, ReceiptHandle: msg.ReceiptHandle});
        });
        // console.log('/////////////////////////////////////////////////////////////////////////////////////');
        
        var params = {
          Entries: done,
          QueueUrl: queueUrl /* required */
        };

        return sqs.deleteMessageBatchAsync(params);
      }

      // console.log('The Queue is empty');
    })

    .then((data) => {
      if (data) {
        // console.log('Deleted:',data); 
      }
      // console.log('Starting next polling');
      pollMessages();
    })

    .catch((err) => {
      console.log(err);
    });
};