const _ = require('underscore');
const path = require('path');
const statsD = require('node-statsd');
// const graphite = require('../../config/graphite.config.js');

var counters = {
  Timers: {
    PollingPeriod: {
      start: 0
    },
    ProcessMessage: {
      start: 0
    },
    ProcessMessageBatch: {
      start: 0
    },
    SaveMessage: {
      start: 0
    },
    SaveMessageBatch: {
      start: 0
    }
  }
};

var stats = new statsD({
  host: 'statsd.hostedgraphite.com',
  port: 8125,
  prefix: '9cc6ccfc-211b-410b-8442-df686a1abe6d'
});

_.extend(stats, counters);

module.exports = stats;


