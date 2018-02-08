const ExpressCassandra = require('express-cassandra');
const cassandraUri = process.env.CASSANDRA_URI || '127.0.0.1';
const cassandraPort = process.env.CASSANDRA_PORT || 9042;

const OrdersNewOrderModel = require('../models/OrdersNewOrderModel');
const PrimeTrialSignupModel = require('../models/PrimeTrialSignupModel');
const PrimeTrialOptoutModel = require('../models/PrimeTrialOptoutModel');
const CountersModel = require('../models/CountersModel');

//Tell express-cassandra to use the models-directory, and
//use bind() to load the models using cassandra configurations.
var models = ExpressCassandra.createClient({
  clientOptions: {
    contactPoints: [cassandraUri],
    protocolOptions: { port: cassandraPort },
    keyspace: 'events',
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
OrdersNewOrder.syncDB(function (err, result) {

  if (err) {
    console.log(err);
    throw err;
  }

  if (result) {
    console.log('OrdersNewOrder Schema has been updated');
  }
  // result == true if any database schema was updated
  // result == false if no schema change was detected in your models
});

PrimeTrialSignup.syncDB(function (err, result) {
  if (err) {
    console.log(err);
    throw err;
  }

  if (result) {
    console.log('PrimeTrialSignup Schema has been updated');
  }

  // result == true if any database schema was updated
  // result == false if no schema change was detected in your models
});

PrimeTrialOptout.syncDB(function (err, result) {
  if (err) {
    console.log(err);
    throw err;
  }

  if (result) {
    console.log('PrimeTrialOptout Schema has been updated');
  }

  // result == true if any database schema was updated
  // result == false if no schema change was detected in your models
});

PrimeTrialOptout.syncDB(function (err, result) {
  if (err) {
    console.log(err);
    throw err;
  }

  if (result) {
    console.log('PrimeTrialOptout Schema has been updated');
  }

  // result == true if any database schema was updated
  // result == false if no schema change was detected in your models
});

PrimeTrialOptout.syncDB(function (err, result) {
  if (err) {
    console.log(err);
    throw err;
  }

  if (result) {
    console.log('PrimeTrialOptout Schema has been updated');
  }

  // result == true if any database schema was updated
  // result == false if no schema change was detected in your models
});

CountersGlobal.syncDBAsync().catch(err => console.log(err));
CountersYear.syncDBAsync().catch(err => console.log(err));
CountersMonth.syncDBAsync().catch(err => console.log(err));
CountersDay.syncDBAsync().catch(err => console.log(err));
CountersCohort.syncDBAsync().catch(err => console.log(err));
CountersHistogramGlobal.syncDBAsync().catch(err => console.log(err));
CountersHistogramYear.syncDBAsync().catch(err => console.log(err));
CountersHistogramMonth.syncDBAsync().catch(err => console.log(err));
CountersHistogramDay.syncDBAsync().catch(err => console.log(err));

console.log(`Connected to Cassandra on ${cassandraUri}:${cassandraPort}`);

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