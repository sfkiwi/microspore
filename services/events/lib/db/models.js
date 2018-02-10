const ExpressCassandra = require('express-cassandra');
const cassandraUri = process.env.CASSANDRA_URI || '127.0.0.1';
const cassandraPort = process.env.CASSANDRA_PORT || 9042;
const keyspace = process.env.KEYSPACE || 'events';

const OrdersNewOrderModel = require('../models/OrdersNewOrderModel');
const PrimeTrialSignupModel = require('../models/PrimeTrialSignupModel');
const PrimeTrialOptoutModel = require('../models/PrimeTrialOptoutModel');
const CountersModel = require('../models/CountersModel');

//Tell express-cassandra to use the models-directory, and
//use bind() to load the models using cassandra configurations.
console.log('Keyspace', keyspace);
var models = ExpressCassandra.createClient({
  clientOptions: {
    contactPoints: [cassandraUri],
    protocolOptions: { port: cassandraPort },
    keyspace: keyspace,
    queryOptions: { consistency: ExpressCassandra.consistencies.one }
  },
  ormOptions: {
    defaultReplicationStrategy: {
      class: 'SimpleStrategy',
      replication_factor: 1
    },
    migration: 'safe'
  }
});

var OrdersNewOrder = models.loadSchema('ordersneworder', OrdersNewOrderModel);
var PrimeTrialSignup = models.loadSchema('primetrialsignup', PrimeTrialSignupModel);
var PrimeTrialOptout = models.loadSchema('primetrialoptout', PrimeTrialOptoutModel);
var CountersGlobal = models.loadSchema('countersglobal', CountersModel.global);
var CountersYear = models.loadSchema('countersyear', CountersModel.year);
var CountersMonth = models.loadSchema('countersmonth', CountersModel.month);
var CountersDay = models.loadSchema('countersday', CountersModel.day);
var CountersCohort = models.loadSchema('counterscohort', CountersModel.cohort);
var CountersHistogramGlobal = models.loadSchema('countershistogramglobal', CountersModel.histogram.global);
var CountersHistogramYear = models.loadSchema('countershistogramyear', CountersModel.histogram.year);
var CountersHistogramMonth = models.loadSchema('countershistogrammonth', CountersModel.histogram.month);
var CountersHistogramDay = models.loadSchema('countershistogramday', CountersModel.histogram.day);

// sync the schema definition with the cassandra database table
// if the schema has not changed, the callback will fire immediately
// otherwise express-cassandra will try to migrate the schema and fire the callback afterwards

(async () => {
  await OrdersNewOrder.syncDBAsync().catch(err => console.log(err));
  await PrimeTrialSignup.syncDBAsync().catch(err => console.log(err));
  await PrimeTrialOptout.syncDBAsync().catch(err => console.log(err));
  await PrimeTrialOptout.syncDBAsync().catch(err => console.log(err));
  await PrimeTrialOptout.syncDBAsync().catch(err => console.log(err));
  await CountersGlobal.syncDBAsync().catch(err => console.log(err));
  await CountersYear.syncDBAsync().catch(err => console.log(err));
  await CountersMonth.syncDBAsync().catch(err => console.log(err));
  await CountersDay.syncDBAsync().catch(err => console.log(err));
  await CountersCohort.syncDBAsync().catch(err => console.log(err));
  await CountersHistogramGlobal.syncDBAsync().catch(err => console.log(err));
  await CountersHistogramYear.syncDBAsync().catch(err => console.log(err));
  await CountersHistogramMonth.syncDBAsync().catch(err => console.log(err));
  await CountersHistogramDay.syncDBAsync().catch(err => console.log(err));
})();

console.log(`Connected to Cassandra on ${cassandraUri}:${cassandraPort}`);
console.log(`Using ${keyspace} keyspace`);

module.exports = {
  Events: {
    OrdersNewOrder: OrdersNewOrder,
    PrimeTrialSignup: PrimeTrialSignup,
    PrimeTrialOptout: PrimeTrialOptout,
    Counters: {
      Global: CountersGlobal,
      Year: CountersYear,
      Month: CountersMonth,
      Day: CountersDay,
      Cohort: CountersCohort,
      Histogram: {
        Global: CountersHistogramGlobal,
        Year: CountersHistogramYear,
        Month: CountersHistogramMonth,
        Day: CountersHistogramDay
      }
    }
  },
  datatypes: models.datatypes, 
  doBatch: models.doBatch,
  doBatchAsync: models.doBatchAsync
};