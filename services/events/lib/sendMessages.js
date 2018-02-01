const AWS = require('aws-sdk');
const Promise = require('bluebird');

AWS.config.update({ region: 'us-east-2' });

var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

sqs.getQueueUrlAsync = Promise.promisify(sqs.getQueueUrl);
sqs.sendMessageAsync = Promise.promisify(sqs.sendMessage);
sqs.sendMessageBatchAsync = Promise.promisify(sqs.sendMessageBatch);


// var message = {
//   MessageBody: '', /* required */
//     QueueUrl: 'STRING_VALUE', /* required */
//     DelaySeconds: 0,
//     MessageAttributes: {
//       '<String>': {
//         DataType: 'STRING_VALUE', /* required */
//         BinaryListValues: [
//           new Buffer('...') || 'STRING_VALUE' /* Strings will be Base-64 encoded on your behalf */,
//           /* more items */
//         ],
//         BinaryValue: new Buffer('...') || 'STRING_VALUE' /* Strings will be Base-64 encoded on your behalf */,
//         StringListValues: [
//           'STRING_VALUE',
//           /* more items */
//         ],
//         StringValue: 'STRING_VALUE'
//       },
//       /* '<String>': ... */
//     },
//     MessageDeduplicationId: 'STRING_VALUE',
//     MessageGroupId: 'STRING_VALUE'
//   };
//   Id: '1', /* required */
//   MessageBody: 'Message 1', /* required */
//   DelaySeconds: 0,
//   MessageAttributes: {
//     'userId': {
//       DataType: 'String', /* required */
//       StringValue: '1234567890'
//     },
//     'orderId': {
//       DataType: 'String',
//       StringValue: '3245245249'
//     }
//   }
// };
//   {
//     Id: '2', /* required */
//     MessageBody: 'Message 2', /* required */
//     DelaySeconds: 0,
//     MessageAttributes: {
//       'userId': {
//         DataType: 'String', /* required */
//         StringValue: '1234567890'
//       },
//       'orderId': {
//         DataType: 'String',
//         StringValue: '3425442549'
//       }
//     }
//   },
//   {
//     Id: '3', /* required */
//     MessageBody: 'Message 3', /* required */
//     DelaySeconds: 0,
//     MessageAttributes: {
//       'userId': {
//         DataType: 'String', /* required */
//         StringValue: '1234567890'
//       },
//       'orderId': {
//         DataType: 'String',
//         StringValue: '3425245359'
//       }
//     }
//   },
//   {
//     Id: '4', /* required */
//     MessageBody: 'Message 4', /* required */
//     DelaySeconds: 0,
//     MessageAttributes: {
//       'userId': {
//         DataType: 'String', /* required */
//         StringValue: '1234567890'
//       },
//       'orderId': {
//         DataType: 'String',
//         StringValue: '32452452459'
//       }
//     }
//   },
//   {
//     Id: '5', /* required */
//     MessageBody: 'Message 5', /* required */
//     DelaySeconds: 0,
//     MessageAttributes: {
//       'userId': {
//         DataType: 'String', /* required */
//         StringValue: '1234567890'
//       },
//       'orderId': {
//         DataType: 'String',
//         StringValue: '32542259'
//       }
//     }
//   },
//   {
//     Id: '6', /* required */
//     MessageBody: 'Message 6', /* required */
//     DelaySeconds: 0,
//     MessageAttributes: {
//       'userId': {
//         DataType: 'String', /* required */
//         StringValue: '1234567890'
//       },
//       'orderId': {
//         DataType: 'String',
//         StringValue: '3425422959'
//       }
//     }
//   },
//   {
//     Id: '7', /* required */
//     MessageBody: 'Message 7', /* required */
//     DelaySeconds: 0,
//     MessageAttributes: {
//       'userId': {
//         DataType: 'String', /* required */
//         StringValue: '1234567890'
//       },
//       'orderId': {
//         DataType: 'String',
//         StringValue: '347532459'
//       }
//     }
//   },
//   {
//     Id: '8', /* required */
//     MessageBody: 'Message 8', /* required */
//     DelaySeconds: 0,
//     MessageAttributes: {
//       'userId': {
//         DataType: 'String', /* required */
//         StringValue: '1234567890'
//       },
//       'orderId': {
//         DataType: 'String',
//         StringValue: '3487643659'
//       }
//     }
//   },
//   {
//     Id: '9', /* required */
//     MessageBody: 'Message 9', /* required */
//     DelaySeconds: 0,
//     MessageAttributes: {
//       'userId': {
//         DataType: 'String', /* required */
//         StringValue: '1234567890'
//       },
//       'orderId': {
//         DataType: 'String',
//         StringValue: '344242959'
//       }
//     }
//   },
//   {
//     Id: '10', /* required */
//     MessageBody: 'Message 10', /* required */
//     DelaySeconds: 0,
//     MessageAttributes: {
//       'userId': {
//         DataType: 'String', /* required */
//         StringValue: '1234567890'
//       },
//       'orderId': {
//         DataType: 'String',
//         StringValue: '3485445239'
//       }
//     }
//   }
//   /* more items */
// ];



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