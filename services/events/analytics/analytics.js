import Koa from 'koa';
import Router from 'koa-router';
import stats from './routes/stats';
import logs from './routes/logs';

const port = process.env.PORT || 3000;

const app = new Koa();

const base = new Router();

const router = new Router({
  prefix: '/api'
});

base
  .get('/', async ctx => {
    ctx.body = { hello: 'World' };
    console.log('Hello World');
  });

router
  .use('/stats', stats.routes())
  .use('/logs', logs.routes());

app
  .use(base.routes())
  .use(router.routes())
  .use(router.allowedMethods())
  .on('error', err => {
    console.error('server error', err)
  });

console.log(`listening on ${port}`);
module.exports = app.listen(port);