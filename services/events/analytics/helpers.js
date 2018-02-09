import db from '../lib/db';
const { OrdersNewOrder, PrimeTrialSignup, PrimeTrialOptout, Counters } = db.models.Events;
const { LocalDate } = db.models.datatypes;

module.exports = {
// Stats Helpers

  getCounter: function(category, period = {}, options = {}) {
    //day
    if (period.day) {
      return Counters.Day.findAsync({ category: category, year: period.year, month: period.month, day: period.day });
      // month
    } else if (period.month) {
      if (options.groupByDay) {
        return Counters.Day.findAsync({ category: category, year: period.year, month: period.month });
      } else {
        return Counters.Month.findAsync({ category: category, year: period.year, month: period.month });
      }
      // year
    } else if (period.year) {
      if (options.groupByMonth) {
        return Counters.Month.findAsync({ category: category, year: period.year });
      } else {
        return Counters.Year.findAsync({ category: category, year: period.year });
      }
      //global
    } else {
      options = period;
      if (options.groupByYear) {
        return Counters.Year.findAsync({ category: category });
      } else {
        return Counters.Global.findAsync({ category: category });
      }
    }
  },

  getCohort: function(category, cohort = {}) {
    return Counters.Cohort.findAsync({ category: category, cohort: new LocalDate(cohort.year, cohort.month, cohort.day) });
  },

  getHistogram: function(category, period = {}) {
    //day
    if (period.day) {
      return Counters.Histogram.Day.findAsync({ category: category, year: period.year, month: period.month, day: period.day });
    // month
    } else if (period.month) {
      return Counters.Histogram.Month.findAsync({ category: category, year: period.year, month: period.month });
    // year
    } else if (period.year) {
      return Counters.Histogram.Year.findAsync({ category: category, year: period.year });
    //global
    } else {
      return Counters.Histogram.Global.findAsync({ category: category });
    }
  },

  // Logs Helpers

  getTrialSignupsByDay: function(year, month, day) {
    let date;

    try {
      date = new LocalDate(year, month, day);
    } catch (err) {
      console.log(err);
      throw new Error(`Incorrect values for date | year:${year}, month:${month}, day:${day}`);
      return;
    }

    let options = {
      select: ['day', 'created', 'userId', 'orderId', 'cartSize'],
      fetchSize: 100
    };

    let rows = [];

    return PrimeTrialSignup.eachRowAsync({ day: date }, options, (n, row) => {
      rows.push(row);
    }).then((result) => {
      return { rows: rows, nextPage: result.pageState };
    });
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

    let options = {
      select: ['day', 'created', 'userId', 'signUp'],
      fetchSize: 100
    };

    let rows = [];

    return PrimeTrialOptout.eachRowAsync({ day: date }, options, (n, row) => {
      rows.push(row);
    }).then((result) => {
      return { rows: rows, nextPage: result.pageState };
    });
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
  }
};