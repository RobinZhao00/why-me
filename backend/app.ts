// backend/app.ts
import Koa from 'koa';
import Router from '@koa/router';

const app = new Koa();
const router = new Router();

router.get('/', ctx => {
  ctx.body = { message: 'Hello from Koa!!' };
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(4000, () => {
  console.log('✅ Koa is running at http://localhost:4000');
});
