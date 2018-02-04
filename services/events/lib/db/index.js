const models = require('./models');
const {OrdersNewOrder, PrimeTrialSignup, PrimeTrialOptout} = models.Events;
const {LocalDate, TimeUuid} = models.datatypes;

module.exports = {
  models: models,

  getTrialSignupsByDay: function(year, month, day) {
    let date;
    
    try {
      date = new LocalDate(year, month, day);
    } catch (err) {
      console.log(err);
      throw new Error(`Incorrect values for date | year:${year}, month:${month}, day:${day}`);
      return;
    }

    return PrimeTrialSignup.findAsync({ day: date }, { select: ['day', 'created', 'orderId', 'userId'], fetchSize: 100});
  },

  getTrialOptoutsByDay: function (year, month, day) {
    let date;

    try {
      date = new LocalDate(year, month, day);
    } catch (err) {
      console.log(err);
      throw new Error(`Incorrect values for date | year:${year}, month:${month}, day:${day}`);
      return;
    }

    return PrimeTrialOptout.findAsync({ day: date }, { select: ['day', 'created', 'userId'], fetchSize: 100 });
  },

  getNewOrdersByDay: function (year, month, day) {
    let date;

    try {
      date = new LocalDate(year, month, day);
    } catch (err) {
      console.log(err);
      throw new Error(`Incorrect values for date | year:${year}, month:${month}, day:${day}`);
      return;
    }

    let options = {
      select: ['day', 'created', 'userId', 'orderId', 'amount'],
      fetchSize: 100
    };

    let rows = [];

    return OrdersNewOrder.eachRowAsync({ day: date }, options, (n, row) => {
      rows.push(row);
    }).then((result) => {
      return { rows: rows, nextPage: result.pageState };
    });
  },
};

