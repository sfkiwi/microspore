const db = require('../lib/db');
const { OrdersNewOrder, Counters } = db.models.Events;
const { LocalDate, TimeUuid, Long } = db.models.datatypes;

let processOrdersNewOrderEvents = (data) => {

  let date = new Date(parseInt(data.timestamp.StringValue));
  let newOrderEvent = {
    amount: parseInt(data.amount.StringValue),
    day: LocalDate.fromDate(date),
    created: new TimeUuid(date),
    userId: data.userId.StringValue,
    orderId: data.userId.StringValue
  };

  var newOrder = new OrdersNewOrder(newOrderEvent);

  var queries = [];

  Promise.all([
    // save event
    newOrder.saveAsync(),
  
    // update Counters
    Counters.Global.updateAsync({ category: data.type.StringValue }, { counter: Long.fromInt(1) }),
    Counters.Year.updateAsync({ category: data.type.StringValue, year: date.getFullYear() }, { counter: Long.fromInt(1) }),
    Counters.Month.updateAsync({ category: data.type.StringValue, year: date.getFullYear(), month: date.getMonth() + 1 }, { counter: Long.fromInt(1) }),
    Counters.Day.updateAsync({ category: data.type.StringValue, year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() }, { counter: Long.fromInt(1) })
  ])
    .catch(err => console.log(err));
};

module.exports = function (message) {
  processOrdersNewOrderEvents(message);
};