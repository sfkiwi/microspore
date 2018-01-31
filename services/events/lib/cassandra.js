const models = require('express-cassandra');

const cassandraUri = process.env.CASSANDRA_URI || '127.0.0.1';
const cassandraPort = process.env.CASSANDRA_PORT || 9042;

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


    var PrimeTrialSignups = new Array(10);

    for (let i = 0; i < 10; i++) {
      PrimeTrialSignups[i] = new models.instance.PrimeTrialSignup({
        userId: Math.floor(Math.random() * 10000000000).toString(),
        orderId: Math.floor(Math.random() * 10000000000).toString(),
        day: new models.datatypes.LocalDate(2018, 1, 26)
      });
    }

    Promise.all(PrimeTrialSignups.map(doc => doc.saveAsync()))
      .then((results) => {
        // exports all table data in current keyspace to the
        // directory: 'fixtures' inside current script directory
        models.import(__dirname + '/fixtures', {batchSize: 100}, function (err) {
          if (err) {
            console.log(err);
            return;
          }
          console.log('Done');
        });
      })

      .catch(err => console.log(err));
    // You'll now have a `person` table in cassandra created against the model
    // schema you've defined earlier and you can now access the model instance
    // in `models.instance.Person` object containing supported orm operations.
  }
);

module.exports = models;