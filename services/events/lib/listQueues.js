var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-2' });

var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

var params = {
  QueueName: 'events'
};

let QueueUrl;

sqs.getQueueUrl(params, function(err, data) {
  if (err) {
    console.log('Error', err);
  } else {
    QueueUrl = data.QueueUrl;
    console.log('Success', data.QueueUrl);
  }
});

var params = {
  DelaySeconds: 10,
  MessageAttributes: {
    'Title': {
      DataType: 'String',
      StringValue: 'The Whistler'
    },
    'Author': {
      DataType: 'String',
      StringValue: 'John Grisham'
    },
    'WeeksOn': {
      DataType: 'Number',
      StringValue: '6'
    }
  },
  MessageBody: 'Information about current NY Times fiction bestseller for week of 12/11/2016.',
  QueueUrl: data.QueueUrl
};

sqs.sendMessage(params, function (err, data) {
  if (err) {
    console.log('Error', err);
  } else {
    console.log('Success', data.MessageId);
  }
});