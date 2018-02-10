const path = require('path');
const models = require('express-cassandra');
const processOrder = require(path.resolve('../../../worker/ordersEvents'));
const db = require(path.resolve('../../db'));
const cassandraUri = process.env.CASSANDRA_URI || '127.0.0.1';
const cassandraPort = process.env.CASSANDRA_PORT || 9042;
const fs = require('fs');
const Progress = require('progress-barzz');

let showProgress = false;
let numberLines = 0;
let lineCount = 0;
let streamEnd = false;

let stack = [];

if (process.argv.length > 3) {
  numberLines = process.argv[3];
  Progress.init(10000);
  showProgress = true;
}

let filename = 'ordersneworder4.json';
if (process.argv.length > 2) {
  filename = process.argv[2];
}

let wait = function(timeout) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, timeout)
  })
};

let start = async function() {
  
  await wait(1000); // wait for db to settle if creating new schemas

  const stream = fs.createReadStream(path.resolve(`../fixtures/${filename}`));
  var buf = '';
  stream.on('data', async (data) => {
    buf += data.toString();
  
    processBuffer();
  });
  
  stream.on('end', () => {
    streamEnd = true;
  });
  
  var processBuffer = async function () {
    var pos;
  
    while ((pos = buf.indexOf('\n')) >= 0) { // keep going while there's a newline somewhere in the buffer
      if (pos === 0) { // if there's more than one newline in a row, the buffer will now start with a newline
        buf = buf.slice(1); // discard it
        continue; // so that the next iteration will start with data
      }
      try {
        processLine(buf.slice(0, pos)); // hand off the line
      } catch (err) {
        console.log(err);
      }
      buf = buf.slice(pos + 1); // and slice the processed data off the buffer
    }
  };
  
  var processLine = async function (line) { 
  
    if (line[line.length - 1] === '\r') {
      line = line.substr(0, line.length - 1); // discard CR (0x0D)
    } 
  
    if (line[0] === '[') {
      line = line.substr(1, line.length); // discard leading [ on first line
    }
  
    if (line[line.length - 1] === ']') {
      line = line.substr(0, line.length - 1); // discard trailing ] on last line
    }
  
    if (line[line.length - 1] === ',') {
      line = line.substr(0, line.length - 1); // discard trailing , on each line
    }
    if (line.length > 0) { // ignore empty lines
      var obj = JSON.parse(line); // parse the JSON

      lineCount++;

      if (lineCount % 10000 === 0) {
        stream.pause();
        setTimeout(() => {
          stream.resume();
        }, 10000);
      }
      
      let msg = {
        type: { StringValue: 'neworder' },
        orderId: { StringValue: obj.orderId },
        userId: { StringValue: obj.userId },
        amount: { StringValue: obj.amount },
        timestamp: { StringValue: new Date(obj.created).valueOf().toString()}
      };
  
      try {
        stack.push(msg);
      } catch (err) {
        console.log(err);
      }
  
      
    }
  };
}

start();

var count = 0;

setInterval(() => {
  
  if (stack.length > 60) {
    for (let i = 0; i < 60; i++) {
      processOrder(stack.pop());
      count++;
      if (showProgress && (count % (numberLines / 10000) === 0)) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(Progress.tick() + ' queue length: ' + stack.length);
      }
    }
  }
}, 50);

