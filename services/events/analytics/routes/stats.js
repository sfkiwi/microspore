import Router from 'koa-router';
import utils from '../helpers';

const stats = new Router()

  // Counters

  .get('/counter/:category/:year/:month/:day', async ctx => {
    ctx.body = await utils.getCounter(ctx.params.category, {
      year: parseInt(ctx.params.year),
      month: parseInt(ctx.params.month),
      day: parseInt(ctx.params.day)
    });
  })


  .get('/counter/:category/:year/:month', async ctx => {
    let options;

    if (ctx.query.groupby === 'day') {
      options = {
        groupByDay: true
      };
    }

    ctx.body = await utils.getCounter(ctx.params.category, {
      year: parseInt(ctx.params.year), 
      month: parseInt(ctx.params.month)
    }, options);
  })

  .get('/counter/:category/:year', async ctx => {
    let options;

    if (ctx.query.groupby === 'month') {
      options = {
        groupByMonth: true
      };
    }

    ctx.body = await utils.getCounter(ctx.params.category, {
      year: parseInt(ctx.params.year)
    }, options);
  })

  .get('/counter/:category', async ctx => {
    let options;

    if (ctx.query.groupby === 'year') {
      options = {
        groupByYear: true
      };
    }

    ctx.body = await utils.getCounter(ctx.params.category, options);
  })

  // Cohorts

  .get('/cohort/:category/:year/:month/:day', async ctx => {
    ctx.body = await utils.getCohort(ctx.params.category, {
      year: parseInt(ctx.params.year),
      month: parseInt(ctx.params.month),
      day: parseInt(ctx.params.day)
    });
  })

  // Histograms

  .get('/histogram/:category/:year/:month/:day', async ctx => {
    ctx.body = await utils.getHistogram(ctx.params.category, {
      year: parseInt(ctx.params.year),
        month: parseInt(ctx.params.month),
        day: parseInt(ctx.params.day)
    });
  })


  .get('/histogram/:category/:year/:month', async ctx => {
    ctx.body = await utils.getHistogram(ctx.params.category, {
      year: parseInt(ctx.params.year),
      month: parseInt(ctx.params.month)
    });
  })

  .get('/histogram/:category/:year', async ctx => {
    ctx.body = await utils.getHistogram(ctx.params.category, {
      year: parseInt(ctx.params.year)
    });
  })

  .get('/histogram/:category', async ctx => {
    ctx.body = await utils.getHistogram(ctx.params.category);
  })


  module.exports = stats;