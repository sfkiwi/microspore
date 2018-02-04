const ExpressCassandra = require('express-cassandra');
const cassandraUri = process.env.CASSANDRA_URI || '127.0.0.1';
const cassandraPort = process.env.CASSANDRA_PORT || 9042;

const OrdersNewOrderModel = require('../models/OrdersNewOrderModel');
const PrimeTrialSignupModel = require('../models/PrimeTrialSignupModel');
const PrimeTrialOptoutModel = require('../models/PrimeTrialOptoutModel');

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

module.exports = {
  Events: {
    OrdersNewOrder: OrdersNewOrder,
    PrimeTrialSignup: PrimeTrialSignup,
    PrimeTrialOptout: PrimeTrialOptout
  },
  datatypes: models.datatypes 
};