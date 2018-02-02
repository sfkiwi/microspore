const models = require('express-cassandra');
const cassandraUri = process.env.CASSANDRA_URI || '127.0.0.1';
const cassandraPort = process.env.CASSANDRA_PORT || 9042;
const fs = require('fs');
const Progress = require('progress-barzz');

let showProgress = false;
let numberLines = 0;
let lineCount = 0;
if (process.argv.length > 3) {
  Progress.init(100);
  numberLines = process.argv[3];
  showProgress = true;
}


//Tell express-cassandra to use the models-directory, and
//use bind() to load the models using cassandra configurations.
models.setDirectory(__dirname + '/models').bind(
  {
    clientOptions: {
      contactPoints: [cassandraUri],
      protocolOptions: { port: cassandraPort },
      keyspace: 'events',
      queryOptions: { consistency: models.consistencies.one }
    },
    ormOptions: {
      defaultReplicationStrategy: {
        class: 'SimpleStrategy',
        replication_factor: 1
      },
      migration: 'safe'
    }
  },
  function (err) {
    if (err) {
      console.log(err);
    }

    let filename = 'primetrialoptout1.json';
    if (process.argv.length > 2) {
      filename = process.argv[2];
    }

    const stream = fs.createReadStream(`./fixtures/${filename}`);
    var buf = '';
    stream.on('data', (data) => {
      buf += data.toString();
      processBuffer();
    });

    stream.on('end', () => {
      console.log(`\n${lineCount} records saved`);
    });

    var processBuffer = function() {
      var pos;

      while ((pos = buf.indexOf('\n')) >= 0) { // keep going while there's a newline somewhere in the buffer
        if (pos === 0) { // if there's more than one newline in a row, the buffer will now start with a newline
          buf = buf.slice(1); // discard it
          continue; // so that the next iteration will start with data
        }
        processLine(buf.slice(0, pos)); // hand off the line
        buf = buf.slice(pos + 1); // and slice the processed data off the buffer
      }
    };

    var processLine = function (line) { 

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
        if (showProgress && (lineCount % (numberLines / 100) === 0)) {
          process.stdout.clearLine();
          process.stdout.cursorTo(0);
          process.stdout.write(Progress.tick());
        }
        
        if (lineCount % 10000 === 0) {
          stream.pause();
          setTimeout(() => {
            stream.resume();
          }, 1000);
        }

        let eventDoc = {
          day: new models.datatypes.LocalDate(parseInt(obj.year), parseInt(obj.month), parseInt(obj.day)),
          created: new models.datatypes.TimeUuid(new Date(obj.created)),
          userId: obj.userId,
        };
        var event = new models.instance.PrimeTrialOptOut(eventDoc);
        event.save(function (err) {
          if (err) {
            stream.pause();

            setTimeout(() => {
              stream.resume();
            }, 1000);
            console.log(err);
          }
        });
      }
    };


    // exports all table data in current keyspace to the
    // directory: 'fixtures' inside current script directory
    // models.import(__dirname + '/fixtures', { batchSize: 100 }, function (err) {
    //   if (err) {
    //     console.log(err);
    //     return;
    //   }
    //   console.log('Done');
    // });
    // You'll now have a `person` table in cassandra created against the model
    // schema you've defined earlier and you can now access the model instance
    // in `models.instance.Person` object containing supported orm operations.
  }
);

module.exports = models;