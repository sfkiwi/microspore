'use strict';


// Make sure to "npm install faker" first.
const randomYear = require('random-year');
const randomMonth = require('random-month');
const randomDay = require('random-day');

let generateRandomData = function(userContext, events, done) {
  // generate data with Faker:
  let year = randomYear({ min: 2017, max: 2018 });
  let month = randomMonth({ raw: true });
  let day = randomDay({ year: year, month: month });
  // add variables to virtual user's context:
  userContext.vars.year = year;
  userContext.vars.month = month.number;
  userContext.vars.day = day;
  // continue with executing the scenario:
  return done();
};

module.exports = {
  generateRandomData: generateRandomData
};