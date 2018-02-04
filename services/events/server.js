import Koa from 'koa';
import Router from 'koa-router';
import db from './lib/db';

const app = new Koa();
const router = new Router({
  prefix: '/api'
});

app.context.db = db;

router

  .get('/orders', async ctx => {
    try {
      ctx.body = await ctx.db.getNewOrdersByDay(
        parseInt(ctx.query.year), 
        parseInt(ctx.query.month), 
        parseInt(ctx.query.day));
    } catch (err) {
      console.log(err);
      throw err;
      return;
    }
  })

  .get('/prime', async ctx => {

  })

app
  .use(router.routes())
  .use(router.allowedMethods())
  
  .on('error', err => {
    log.error('server error', err)
  });

console.log('listening on 3000');
app.listen(3000);