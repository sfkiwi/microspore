const AWS = require('aws-sdk');
const Promise = require('bluebird');

AWS.config.update({ region: 'us-east-2' });

var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

sqs.getQueueUrlAsync = Promise.promisify(sqs.getQueueUrl);
sqs.sendMessageAsync = Promise.promisify(sqs.sendMessage);
sqs.sendMessageBatchAsync = Promise.promisify(sqs.sendMessageBatch);


var params = {
  QueueName: 'events'
};

var queueUrl;
var count = 0;

sqs.getQueueUrlAsync(params)

  .then((data) => {
    console.log('Success', data.QueueUrl);
    queueUrl = data.QueueUrl;
    sendMessage();
    setInterval(sendMessage, 5);
  });


let sendMessage = () => {

  params = {
    MessageBody: `Message ${count}`, /* required */
    QueueUrl: queueUrl, /* required */
    MessageAttributes: {
      'userId': {
        DataType: 'String', /* required */
        StringValue: `U${count}`
      },
      'orderId': {
        DataType: 'String',
        StringValue: `O${count}`
      }
    /* '<String>': ... */
    }
  };

  console.log('Sending Message', count);

  count++;

  sqs.sendMessageAsync(params)

    .then((data) => {
      // console.log(data);
    })

    .catch((err) => {
      console.log(err);
    });
};