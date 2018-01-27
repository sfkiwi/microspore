const Koa = require('koa');
const app = new Koa();

//app.context.db = db();


app.use(async ctx => {
  ctx.response.status = 200;
  ctx.response.body = { hello: 'world' };
});

app.on('error', err => {
  log.error('server error', err)
});

app.listen(3000);