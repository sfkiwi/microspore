import Koa from 'koa';
import Router from 'koa-router';
import stats from './routes/stats';
import logs from './routes/logs';

const app = new Koa();

const router = new Router({
  prefix: '/api'
});

router

  .use('/stats', stats.routes())
  .use('/logs', logs.routes());

app
  .use(router.routes())
  .use(router.allowedMethods())
  
  .on('error', err => {
    console.error('server error', err)
  });

console.log('listening on 3000');
app.listen(3000);