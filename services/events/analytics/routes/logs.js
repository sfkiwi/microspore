import Router from 'koa-router';
import utils from '../helpers';

const logs = new Router()

  .get('/orders/:event', async ctx => {

    let year, month, day;

    try {
      year = parseInt(ctx.query.year);
      month = parseInt(ctx.query.month);
      day = parseInt(ctx.query.day);
    } catch (err) {
      ctx.throw(400, 'Invalid date, year, month and day required as query parameters', ctx.query );
      return;
    }

    if (ctx.params.event === 'neworder') {
      ctx.body = await utils.getNewOrdersByDay(year, month, day);
    }
  })

  .get('/prime/:event', async ctx => {
    let year, month, day;

    try {
      year = parseInt(ctx.query.year);
      month = parseInt(ctx.query.month);
      day = parseInt(ctx.query.day);
    } catch (err) {
      ctx.throw(400, 'Invalid date, year, month and day required as query parameters', ctx.query);
      return;
    }

    if (ctx.params.event === 'trialsignup') {
      ctx.body = await utils.getTrialSignupsByDay(year, month, day);
    } 

    if (ctx.params.event === 'trialoptout') {
      ctx.body = await utils.getTrialOptoutsByDay(year, month, day);
    }

  });

  module.exports = logs;